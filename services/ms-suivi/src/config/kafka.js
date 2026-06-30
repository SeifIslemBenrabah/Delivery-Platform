const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ms-suivi',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: { retries: 5, initialRetryTime: 300 },
});

const consumer = kafka.consumer({ groupId: 'ms-suivi-group' });

const connect = async () => {
  await consumer.connect();
  console.log('[Kafka] Consumer connected');
};

module.exports = { consumer, connect };