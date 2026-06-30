require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const boutiqueRoutes  = require('./routes/boutiqueRoutes');
const catalogueRoutes = require('./routes/catalogueRoutes');
const produitRoutes   = require('./routes/produitRoutes');
const commandeRoutes  = require('./routes/commandeRoutes');
const errorHandler    = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/boutiques',  boutiqueRoutes);
app.use('/api/catalogues', catalogueRoutes);
app.use('/api/products',   produitRoutes);
app.use('/api/orders',     commandeRoutes);

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ms-commande-catalogue' }));

// ─── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use(errorHandler);

module.exports = app;