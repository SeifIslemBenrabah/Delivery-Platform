const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ms-commande-catalogue',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: { retries: 5, initialRetryTime: 300 },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'ms-commande-group' });

const connect = async () => {
  await producer.connect();
  await consumer.connect();
  console.log('[Kafka] Producer and consumer connected');
};

const publish = async (topic, key, value) => {
  await producer.send({
    topic,
    messages: [{ key: String(key), value: JSON.stringify(value) }],
  });
};

module.exports = { kafka, producer, consumer, connect, publish };