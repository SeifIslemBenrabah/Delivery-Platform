const { Commande, CommandeItem, Produit, Boutique } = require('../models');
const { calculatePrices } = require('../utils/priceCalculator');
const { publish } = require('../config/kafka');

// ─── Valid status transitions ─────────────────────────────────────────────
const ALLOWED_TRANSITIONS = {
  PENDING:     ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:   ['ASSIGNED', 'CANCELLED'],
  ASSIGNED:    ['PICKED_UP', 'CANCELLED'],
  PICKED_UP:   ['IN_DELIVERY'],
  IN_DELIVERY: ['DELIVERED'],
  DELIVERED:   [],
  CANCELLED:   [],
};

// Who can change to which status
const ROLE_TRANSITIONS = {
  COMMERCANT: ['CONFIRMED', 'CANCELLED'],
  LIVREUR:    ['PICKED_UP', 'IN_DELIVERY', 'DELIVERED'],
  ADMIN:      Object.keys(ALLOWED_TRANSITIONS),
};

// ─── GET /orders (admin) ──────────────────────────────────────────────────
const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.statusCommande = req.query.status;
    const commandes = await Commande.findAll({
      where,
      include: [{ model: CommandeItem, as: 'items' }],
      order: [['date', 'DESC']],
    });
    res.json(commandes);
  } catch (err) { next(err); }
};

// ─── GET /orders/mine ─────────────────────────────────────────────────────
const getMine = async (req, res, next) => {
  try {
    const where =
      req.user.role === 'CLIENT'
        ? { idClient: req.user.userId }
        : req.user.role === 'LIVREUR'
        ? { idLivreur: req.user.userId }
        : { idBoutique: req.query.boutique };

    const commandes = await Commande.findAll({
      where,
      include: [{ model: CommandeItem, as: 'items' }],
      order: [['date', 'DESC']],
    });
    res.json(commandes);
  } catch (err) { next(err); }
};

// ─── GET /orders/available ───────────────────────────────────────────────
const getAvailable = async (req, res, next) => {
  try {
    // Orders confirmed by commerçant, not yet assigned to a livreur
    const commandes = await Commande.findAll({
      where: { statusCommande: 'CONFIRMED', idLivreur: null },
      include: [{ model: CommandeItem, as: 'items' }],
      order: [['date', 'ASC']],
    });
    res.json(commandes);
  } catch (err) { next(err); }
};

// ─── GET /orders/:id ─────────────────────────────────────────────────────
const getById = async (req, res, next) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [{ model: CommandeItem, as: 'items' }],
    });
    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(commande);
  } catch (err) { next(err); }
};

// ─── POST /orders ─────────────────────────────────────────────────────────
const create = async (req, res, next) => {
  try {
    const { idBoutique, dropOffAddress, items, livraisonType } = req.body;

    if (!idBoutique || !dropOffAddress || !items?.length) {
      return res.status(400).json({ error: 'idBoutique, dropOffAddress et items sont requis' });
    }

    const boutique = await Boutique.findByPk(idBoutique);
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });

    // Fetch products and validate stock
    const produitIds = items.map((i) => i.idProduit);
    const produits = await Produit.findAll({ where: { idProduit: produitIds } });
    const produitMap = Object.fromEntries(produits.map((p) => [p.idProduit, p]));

    for (const item of items) {
      const p = produitMap[item.idProduit];
      if (!p) return res.status(404).json({ error: `Produit ${item.idProduit} introuvable` });
      if (p.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuffisant pour ${p.nomProduit}` });
      }
    }

    // Build items with price snapshot
    const enrichedItems = items.map((item) => ({
      idProduit:   item.idProduit,
      nomProduit:  produitMap[item.idProduit].nomProduit,
      quantity:    item.quantity,
      unitPrice:   produitMap[item.idProduit].price,
    }));

    const { totalPrice, livraisonPrice } = calculatePrices(
      enrichedItems, livraisonType || 'STANDARD'
    );

    const commande = await Commande.create({
      pickUpAddress:  boutique.address,
      dropOffAddress,
      livraisonType:  livraisonType || 'STANDARD',
      idClient:       req.user.userId,
      idBoutique,
      totalPrice,
      livraisonPrice,
    });

    const commandeItems = await CommandeItem.bulkCreate(
      enrichedItems.map((i) => ({ ...i, idCommande: commande.idCommande }))
    );

    // Decrement stock
    for (const item of enrichedItems) {
      await Produit.decrement('stock', {
        by: item.quantity,
        where: { idProduit: item.idProduit },
      });
    }

    // Publish event for ms-optimisation
    await publish('order.created', commande.idCommande, {
      idCommande:     commande.idCommande,
      idBoutique,
      pickUpAddress:  boutique.address,
      dropOffAddress,
      livraisonType:  commande.livraisonType,
      createdAt:      commande.date,
    });

    res.status(201).json({ ...commande.toJSON(), items: commandeItems });
  } catch (err) { next(err); }
};

// ─── PATCH /orders/:id/status ────────────────────────────────────────────
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

    const allowed = ALLOWED_TRANSITIONS[commande.statusCommande] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Transition ${commande.statusCommande} → ${status} invalide`,
      });
    }

    const roleAllowed = ROLE_TRANSITIONS[req.user.role] || [];
    if (!roleAllowed.includes(status)) {
      return res.status(403).json({ error: 'Vous ne pouvez pas effectuer cette transition' });
    }

    commande.statusCommande = status;
    await commande.save();

    await publish('order.status.updated', commande.idCommande, {
      idCommande:     commande.idCommande,
      statusCommande: status,
      idLivreur:      commande.idLivreur,
      idClient:       commande.idClient,
      updatedAt:      new Date(),
    });

    res.json(commande);
  } catch (err) { next(err); }
};

// ─── PATCH /orders/:id/assign ────────────────────────────────────────────
const assignToLivreur = async (req, res, next) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
    if (commande.statusCommande !== 'CONFIRMED') {
      return res.status(400).json({ error: 'La commande doit être confirmée pour être assignée' });
    }
    if (commande.idLivreur) {
      return res.status(400).json({ error: 'Cette commande est déjà assignée' });
    }

    const livreurId = req.body.livreurId || req.user.userId;
    commande.idLivreur      = livreurId;
    commande.statusCommande = 'ASSIGNED';
    await commande.save();

    await publish('order.status.updated', commande.idCommande, {
      idCommande:     commande.idCommande,
      statusCommande: 'ASSIGNED',
      idLivreur:      livreurId,
      idClient:       commande.idClient,
      updatedAt:      new Date(),
    });

    res.json(commande);
  } catch (err) { next(err); }
};

module.exports = { getAll, getMine, getAvailable, getById, create, updateStatus, assignToLivreur };