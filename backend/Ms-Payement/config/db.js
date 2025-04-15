const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connexion à la base de données
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Désactiver les logs SQL (optionnel)
});

// Vérifier la connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à MySQL réussie !');
  } catch (error) {
    console.error('Erreur de connexion à MySQL :', error);
  }
}

testConnection();

module.exports = sequelize;
