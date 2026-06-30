const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ms-paiement',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: { retries: 5, initialRetryTime: 300 },
});

const producer = kafka.producer();

const connect = async () => {
  await producer.connect();
  console.log('[Kafka] Producer connected');
};

const publish = async (topic, key, value) => {
  await producer.send({
    topic,
    messages: [{ key: String(key), value: JSON.stringify(value) }],
  });
};

module.exports = { producer, connect, publish };