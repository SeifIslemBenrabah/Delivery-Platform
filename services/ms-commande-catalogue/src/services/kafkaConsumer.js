const { consumer } = require('../config/kafka');
const { Commande } = require('../models');

const startConsumer = async () => {
  await consumer.subscribe({ topics: ['payment.completed'], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value.toString());

        if (topic === 'payment.completed') {
          const { idCommande } = event;
          const commande = await Commande.findByPk(idCommande);
          if (commande && commande.statusCommande === 'PENDING') {
            commande.statusCommande = 'CONFIRMED';
            await commande.save();
            console.log(`[Kafka] Order ${idCommande} confirmed after payment`);
          }
        }
      } catch (err) {
        console.error('[Kafka Consumer Error]', err.message);
      }
    },
  });
};

module.exports = { startConsumer };