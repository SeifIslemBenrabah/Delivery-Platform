const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Produit = sequelize.define('Produit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  chargily_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

module.exports = Produit;
