const { consumer } = require('../config/kafka');
const CommandeTracking = require('../models/CommandeTracking');
const LivreurTracking  = require('../models/LivreurTracking');

let _io = null;

const setIo = (io) => { _io = io; };

const start = async () => {
  await consumer.subscribe({
    topics: ['order.status.updated', 'order.created', 'route.optimized', 'livreur.position'],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        await handle(topic, event);
      } catch (err) {
        console.error(`[Kafka Consumer] Error on topic ${topic}:`, err.message);
      }
    },
  });
};

const handle = async (topic, event) => {
  // ─── New order created ──────────────────────────────────────────────────
  if (topic === 'order.created') {
    const { idCommande, idClient, pickUpAddress, dropOffAddress } = event;
    await CommandeTracking.findOneAndUpdate(
      { idCommande },
      {
        idCommande,
        idClient,
        statusCommande: 'PENDING',
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  // ─── Order status changed ───────────────────────────────────────────────
  else if (topic === 'order.status.updated') {
    const { idCommande, statusCommande, idLivreur, idClient } = event;

    await CommandeTracking.findOneAndUpdate(
      { idCommande },
      { statusCommande, idLivreur, idClient, updatedAt: new Date() },
      { upsert: true }
    );

    // Broadcast status to all subscribers of this order
    if (_io) {
      _io.to(`order:${idCommande}`).emit(`tracking:status:${idCommande}`, statusCommande);
    }
  }

  // ─── Optimized route received ───────────────────────────────────────────
  else if (topic === 'route.optimized') {
    const { idLivreur, polyline } = event;

    // Find all active orders for this livreur and store route
    const orders = await CommandeTracking.find({
      idLivreur,
      statusCommande: { $in: ['ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'] },
    }).lean();

    for (const order of orders) {
      await CommandeTracking.updateOne(
        { idCommande: order.idCommande },
        { routePolyline: polyline || [] }
      );
      if (_io && polyline?.length) {
        _io.to(`order:${order.idCommande}`).emit(
          `tracking:route:${order.idCommande}`,
          polyline
        );
      }
    }
  }

  // ─── Livreur position update (from ms-optimisation or direct) ──────────
  else if (topic === 'livreur.position') {
    const { idLivreur, lat, lng } = event;
    if (!idLivreur || lat == null || lng == null) return;

    await LivreurTracking.findOneAndUpdate(
      { idLivreur },
      {
        idLivreur,
        location: { type: 'Point', coordinates: [lng, lat] },
        updatedAt: new Date(),
      },
      { upsert: true }
    );
  }
};

module.exports = { start, setIo };