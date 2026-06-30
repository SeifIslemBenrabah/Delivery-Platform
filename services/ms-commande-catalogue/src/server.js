require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { connect } = require('./config/kafka');
const { startConsumer } = require('./services/kafkaConsumer');

const PORT = process.env.PORT || 8081;

const start = async () => {
  try {
    // ─── Database ─────────────────────────────────────────────────────────
    await sequelize.authenticate();
    console.log('[DB] MySQL connected');
    await sequelize.sync({ alter: true });
    console.log('[DB] Models synchronized');

    // ─── Kafka ────────────────────────────────────────────────────────────
    await connect();
    await startConsumer();

    // ─── HTTP ─────────────────────────────────────────────────────────────
    app.listen(PORT, () => {
      console.log(`[ms-commande-catalogue] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
};

start();