const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Catalogue = sequelize.define('Catalogue', {
  idCatalogue: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nomCatalogue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idBoutique: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'catalogues',
});

module.exports = Catalogue;