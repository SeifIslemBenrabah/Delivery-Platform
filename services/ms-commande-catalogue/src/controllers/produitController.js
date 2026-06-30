const { Produit, Boutique } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.boutique) where.idBoutique = req.query.boutique;
    if (req.query.catalogue) where.idCatalogue = req.query.catalogue;
    const produits = await Produit.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(produits);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(produit);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { nomProduit, price, description, stock, idCatalogue, idBoutique } = req.body;
    if (!nomProduit || !price || !idBoutique) {
      return res.status(400).json({ error: 'nomProduit, price et idBoutique sont requis' });
    }
    const boutique = await Boutique.findByPk(idBoutique);
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });
    if (boutique.idCommercant !== req.user.userId) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    const photoProduit = req.file?.path ?? null;
    const produit = await Produit.create({
      nomProduit,
      price: parseFloat(price),
      description,
      photoProduit,
      stock: parseInt(stock || '0'),
      idCatalogue,
      idBoutique,
    });
    res.status(201).json(produit);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const produit = await Produit.findByPk(req.params.id, {
      include: [{ model: Boutique, as: 'boutique' }],
    });
    if (!produit) return res.status(404).json({ error: 'Produit introuvable' });
    if (produit.boutique.idCommercant !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    const { nomProduit, price, description, stock, chargilyId } = req.body;
    if (nomProduit)  produit.nomProduit  = nomProduit;
    if (price)       produit.price       = parseFloat(price);
    if (description) produit.description = description;
    if (stock !== undefined) produit.stock = parseInt(stock);
    if (chargilyId)  produit.chargilyId  = chargilyId;
    if (req.file)    produit.photoProduit = req.file.path;
    await produit.save();
    res.json(produit);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const produit = await Produit.findByPk(req.params.id, {
      include: [{ model: Boutique, as: 'boutique' }],
    });
    if (!produit) return res.status(404).json({ error: 'Produit introuvable' });
    if (produit.boutique.idCommercant !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    await produit.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };