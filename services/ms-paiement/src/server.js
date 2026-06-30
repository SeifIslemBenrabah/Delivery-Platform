require('dotenv').config();
const app                        = require('./app');
const { sequelize }              = require('./models');
const { connect: connectKafka }  = require('./config/kafka');

const PORT = process.env.PORT || 3004;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('[ms-paiement] MySQL connecté');

    await sequelize.sync({ alter: true });
    console.log('[ms-paiement] Tables synchronisées');

    await connectKafka();
    console.log('[ms-paiement] Kafka connecté');

    app.listen(PORT, () => {
      console.log(`[ms-paiement] Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('[ms-paiement] Erreur démarrage:', err);
    process.exit(1);
  }
};

start();