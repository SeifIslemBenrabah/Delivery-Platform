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
    type: DataTypes.STRING, // Changed this to match the type in Produit model
    references: {
      model: Produit,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  timestamps: true,
});

// Define the many-to-many relationships
Paiement.belongsToMany(Produit, { through: ProduitPaiement, foreignKey: 'id_paiement' });
Produit.belongsToMany(Paiement, { through: ProduitPaiement, foreignKey: 'id_produit' });

module.exports = ProduitPaiement;
