const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boutique = sequelize.define('Boutique', {
  idBoutique: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nomBoutique: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoFrontBoutique: {
    type: DataTypes.STRING,
  },
  idCommercant: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'boutiques',
});

module.exports = Boutique;