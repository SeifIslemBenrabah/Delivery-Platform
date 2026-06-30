const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  paymentId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idCommande: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  idClient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idLivreur: {
    type: DataTypes.STRING,
  },
  idCommercant: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
    defaultValue: 'PENDING',
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  livraisonPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  method: {
    type: DataTypes.ENUM('CARD', 'CCP', 'EDAHABIA'),
    defaultValue: 'CARD',
  },
  chargilyCheckoutId: {
    type: DataTypes.STRING,
  },
  chargilyCheckoutUrl: {
    type: DataTypes.STRING(1024),
  },
  paidAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'payments',
});

module.exports = Payment;