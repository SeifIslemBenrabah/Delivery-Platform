const sequelize        = require('../config/database');
const Payment          = require('./Payment');
const LivreurEarnings  = require('./LivreurEarnings');
const CommercantRevenu = require('./CommercantRevenu');

// Associations (none cross-model here, but sequelize instance is exported for raw queries)

module.exports = { sequelize, Payment, LivreurEarnings, CommercantRevenu };