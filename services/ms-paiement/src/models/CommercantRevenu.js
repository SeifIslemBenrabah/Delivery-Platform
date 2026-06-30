const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommercantRevenu = sequelize.define('CommercantRevenu', {
  idCommercant: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  revenuTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  tableName: 'commercant_revenus',
});

module.exports = CommercantRevenu;