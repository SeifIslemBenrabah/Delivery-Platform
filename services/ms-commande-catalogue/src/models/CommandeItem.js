const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommandeItem = sequelize.define('CommandeItem', {
  idItem: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idCommande: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  idProduit: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nomProduit: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'commande_items',
});

module.exports = CommandeItem;