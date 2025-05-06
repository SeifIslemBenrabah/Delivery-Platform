const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Livreur = sequelize.define('Livreur', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  card_number: {
    type: DataTypes.STRING,
    unique:true
  },
  revenu_total: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

module.exports = Livreur;
