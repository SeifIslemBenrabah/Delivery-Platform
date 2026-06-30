const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produit = sequelize.define('Produit', {
  idProduit: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nomProduit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  photoProduit: {
    type: DataTypes.STRING,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  chargilyId: {
    type: DataTypes.STRING,
  },
  idCatalogue: {
    type: DataTypes.UUID,
  },
  idBoutique: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'produits',
});

module.exports = Produit;