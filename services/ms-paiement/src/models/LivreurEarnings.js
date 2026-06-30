const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LivreurEarnings = sequelize.define('LivreurEarnings', {
  idLivreur: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  totalRevenu: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  revenuRetire: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  carteBancaire: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'livreur_earnings',
});

module.exports = LivreurEarnings;