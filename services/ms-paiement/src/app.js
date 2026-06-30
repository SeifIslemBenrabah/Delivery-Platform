const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));

// Preserve raw body for Chargily HMAC verification
app.use((req, res, next) => {
  let data = [];
  req.on('data', (chunk) => data.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    req.body = req.rawBody.length ? (() => {
      try { return JSON.parse(req.rawBody.toString()); } catch { return {}; }
    })() : {};
    next();
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ms-paiement' }));

app.use('/api/payment', paymentRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Erreur interne' });
});

module.exports = app;