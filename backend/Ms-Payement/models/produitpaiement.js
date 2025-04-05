const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paiement = require('./paiement');
const Produit = require('./produit');

const ProduitPaiement = sequelize.define('ProduitPaiement', {
  id_paiement: {
    type: DataTypes.INTEGER,
    references: {
      model: Paiement,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  id_produit: {
    type: DataTypes.STRING,
    references: {
      model: Produit,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

// Définition des relations Many-to-Many
Paiement.belongsToMany(Produit, { through: ProduitPaiement, foreignKey: 'paiementId' });
Produit.belongsToMany(Paiement, { through: ProduitPaiement, foreignKey: 'produitId' });

module.exports = ProduitPaiement;
