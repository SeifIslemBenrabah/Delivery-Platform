require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const trackingRoutes = require('./routes/trackingRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/tracking', trackingRoutes);

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'ms-suivi' })
);

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' });
});

module.exports = app;