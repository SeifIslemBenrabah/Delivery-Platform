const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paiement = sequelize.define('Paiement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  checkout_url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  prix_total: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  prix_commercent: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  prix_livraison: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  id_commande: {
    type: DataTypes.STRING,
    defaultValue:0
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

module.exports = Paiement;
