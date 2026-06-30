require('dotenv').config();
const http   = require('http');
const { Server } = require('socket.io');
const app    = require('./app');
const { connect: connectDb } = require('./config/database');
const { connect: connectKafka } = require('./config/kafka');
const { registerHandlers }    = require('./socket/trackingHandler');
const kafkaConsumer = require('./services/kafkaConsumer');

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    // ─── MongoDB ────────────────────────────────────────────────────────
    await connectDb();

    // ─── HTTP + Socket.IO ───────────────────────────────────────────────
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
      path: '/ws/',        // matches nginx proxy_pass /ws/
      transports: ['websocket', 'polling'],
    });

    registerHandlers(io);

    // ─── Kafka ──────────────────────────────────────────────────────────
    await connectKafka();
    kafkaConsumer.setIo(io);   // share io reference so Kafka events can broadcast
    await kafkaConsumer.start();

    // ─── Listen ─────────────────────────────────────────────────────────
    httpServer.listen(PORT, () => {
      console.log(`[ms-suivi] HTTP + WebSocket running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
};

start();