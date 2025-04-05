const { Sequelize } = require('sequelize');

// Connexion à la base de données
const sequelize = new Sequelize('ma_base', 'root', '', {
  host: 'localhost',
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
