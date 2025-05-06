const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Livreur = require('./livreur');
const Commercent = require('./commercent');

const Paiement = sequelize.define('Paiement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  checkout_url: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true
  },
  checkout_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true
  },
  prix_total: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  prix_commercent: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  prix_livraison: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  id_commande: {
    type: DataTypes.STRING,
    defaultValue:0
  },
  id_livreur: {
    type: DataTypes.STRING,
    references: {
        model: Livreur,
        key: 'id'
    },
  },
  id_commercent: {
    type: DataTypes.INTEGER,
    references: {
        model: Commercent,
        key: 'id'
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:"pending"
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

Livreur.hasMany(Paiement, { foreignKey: 'id_livreur', as: 'paiments' });
Paiement.belongsTo(Livreur, { foreignKey: 'id_livreur', as: 'livreur'});

Commercent.hasMany(Paiement, { foreignKey: 'id_commercent', as: 'paiments' });
Paiement.belongsTo(Commercent, { foreignKey: 'id_commercent', as: 'commercent'});

module.exports = Paiement;
