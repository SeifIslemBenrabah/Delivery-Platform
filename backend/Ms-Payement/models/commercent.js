const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Commercent = sequelize.define('Commercent', {
  id: {
    type: DataTypes.INTEGER,
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

module.exports = Commercent;
