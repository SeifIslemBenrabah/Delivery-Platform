const axios                                    = require('axios');
const { v4: uuidv4 }                           = require('uuid');
const { Payment, LivreurEarnings, CommercantRevenu } = require('../models');
const { createCheckout, verifyWebhookSignature } = require('../services/chargilyService');
const { generateInvoice }                      = require('../services/invoiceService');
const { publish }                              = require('../config/kafka');

const MS_USER_URL = process.env.MS_UTILISATEUR_URL || 'http://ms-utilisateur:3001';

// ─── Initiate payment ─────────────────────────────────────────────────────────
const initiatePayment = async (req, res) => {
  const { idCommande, idLivreur, idCommercant, totalAmount, livraisonPrice, method } = req.body;
  const idClient = req.user.userId;

  try {
    // Prevent duplicates
    const existing = await Payment.findOne({ where: { idCommande } });
    if (existing) {
      return res.status(409).json({ error: 'Paiement déjà initié pour cette commande' });
    }

    const paymentId = uuidv4();

    // Fetch client info for Chargily
    let clientName = 'Client', clientEmail = '';
    try {
      const { data } = await axios.get(`${MS_USER_URL}/api/users/${idClient}`, {
        headers: { Authorization: req.headers.authorization },
      });
      clientName  = `${data.prenom} ${data.nom}`;
      clientEmail = data.email;
    } catch { /* non-blocking */ }

    const { checkoutId, checkoutUrl } = await createCheckout({
      orderId: idCommande,
      amount:  totalAmount,
      clientName,
      clientEmail,
    });

    const payment = await Payment.create({
      paymentId,
      idCommande,
      idClient,
      idLivreur,
      idCommercant,
      totalAmount,
      livraisonPrice,
      method:              method || 'CARD',
      status:              'PENDING',
      chargilyCheckoutId:  checkoutId,
      chargilyCheckoutUrl: checkoutUrl,
    });

    res.status(201).json({
      paymentId:   payment.paymentId,
      checkoutUrl: payment.chargilyCheckoutUrl,
      status:      payment.status,
    });
  } catch (err) {
    console.error('initiatePayment error:', err.message);
    res.status(500).json({ error: 'Échec de l\'initiation du paiement' });
  }
};

// ─── Chargily webhook ─────────────────────────────────────────────────────────
const webhook = async (req, res) => {
  const signature = req.headers['x-chargily-signature'] || '';

  if (!verifyWebhookSignature(req.rawBody, signature)) {
    return res.status(401).json({ error: 'Signature invalide' });
  }

  const event = req.body;
  if (event.type !== 'checkout.paid') {
    return res.status(200).json({ received: true }); // ACK unknown events
  }

  const orderId = event.data?.metadata?.orderId;
  if (!orderId) return res.status(400).json({ error: 'orderId manquant dans metadata' });

  try {
    const payment = await Payment.findOne({ where: { idCommande: orderId } });
    if (!payment) return res.status(404).json({ error: 'Paiement introuvable' });
    if (payment.status === 'PAID') return res.status(200).json({ received: true });

    await payment.update({ status: 'PAID', paidAt: new Date() });

    // Distribute earnings
    const livraisonAmt = Number(payment.livraisonPrice) || 0;
    const produitAmt   = Number(payment.totalAmount) - livraisonAmt;

    await Promise.allSettled([
      // Livreur earnings — create row if absent, then increment
      LivreurEarnings.findOrCreate({
        where: { idLivreur: payment.idLivreur },
        defaults: { totalRevenu: 0, revenuRetire: 0 },
      }).then(() =>
        LivreurEarnings.increment('totalRevenu', {
          by: livraisonAmt, where: { idLivreur: payment.idLivreur },
        })
      ),
      // Commercant revenue — create row if absent, then increment
      CommercantRevenu.findOrCreate({
        where: { idCommercant: payment.idCommercant },
        defaults: { revenuTotal: 0 },
      }).then(() =>
        CommercantRevenu.increment('revenuTotal', {
          by: produitAmt, where: { idCommercant: payment.idCommercant },
        })
      ),
      // Notify ms-utilisateur for livreur revenu field
      axios.patch(
        `${MS_USER_URL}/api/users/${payment.idLivreur}/revenu`,
        { amount: livraisonAmt },
        { headers: { 'x-internal': 'true' } }
      ).catch(() => {}),
    ]);

    // Publish Kafka event
    await publish('payment.completed', orderId, {
      paymentId:    payment.paymentId,
      idCommande:   orderId,
      idClient:     payment.idClient,
      idLivreur:    payment.idLivreur,
      idCommercant: payment.idCommercant,
      totalAmount:  payment.totalAmount,
      paidAt:       payment.paidAt,
    });

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('webhook error:', err.message);
    res.status(500).json({ error: 'Erreur traitement webhook' });
  }
};

// ─── Get single payment ───────────────────────────────────────────────────────
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Paiement introuvable' });

    const isOwner = [payment.idClient, payment.idLivreur, payment.idCommercant]
      .includes(req.user.userId);
    if (!isOwner && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── List my payments ─────────────────────────────────────────────────────────
const listMyPayments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let where = {};

    if (role === 'CLIENT')     where = { idClient:     userId };
    else if (role === 'LIVREUR')    where = { idLivreur:    userId };
    else if (role === 'COMMERCANT') where = { idCommercant: userId };

    const payments = await Payment.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── All payments (admin) ─────────────────────────────────────────────────────
const listAll = async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [['createdAt', 'DESC']] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Download invoice PDF ─────────────────────────────────────────────────────
const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Paiement introuvable' });
    if (payment.status !== 'PAID') {
      return res.status(400).json({ error: 'Facture disponible uniquement après paiement' });
    }

    const isOwner = [payment.idClient, payment.idLivreur, payment.idCommercant]
      .includes(req.user.userId);
    if (!isOwner && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    const buffer = await generateInvoice(payment.toJSON());
    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${payment.paymentId.slice(0, 8)}.pdf"`,
      'Content-Length':      buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    console.error('downloadInvoice error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─── Livreur earnings ─────────────────────────────────────────────────────────
const getMyEarnings = async (req, res) => {
  try {
    const record = await LivreurEarnings.findByPk(req.user.userId);
    res.json(record || { totalRevenu: 0, revenuRetire: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Commercant revenue ───────────────────────────────────────────────────────
const getMyRevenu = async (req, res) => {
  try {
    const record = await CommercantRevenu.findByPk(req.user.userId);
    res.json(record || { revenuTotal: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Refund (admin) ───────────────────────────────────────────────────────────
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Paiement introuvable' });
    if (payment.status !== 'PAID') {
      return res.status(400).json({ error: 'Seuls les paiements PAID peuvent être remboursés' });
    }
    await payment.update({ status: 'REFUNDED' });
    res.json({ message: 'Remboursement enregistré', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initiatePayment,
  webhook,
  getPayment,
  listMyPayments,
  listAll,
  downloadInvoice,
  getMyEarnings,
  getMyRevenu,
  refundPayment,
};