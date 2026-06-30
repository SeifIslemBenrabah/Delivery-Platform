const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'ASSIGNED',
  'PICKED_UP', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED',
];

const Commande = sequelize.define('Commande', {
  idCommande: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  pickUpAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dropOffAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusCommande: {
    type: DataTypes.ENUM(...ORDER_STATUSES),
    defaultValue: 'PENDING',
  },
  livraisonType: {
    type: DataTypes.ENUM('STANDARD', 'EXPRESS'),
    defaultValue: 'STANDARD',
  },
  idClient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idLivreur: {
    type: DataTypes.STRING,
  },
  idBoutique: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  livraisonPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  tableName: 'commandes',
});

module.exports = Commande;