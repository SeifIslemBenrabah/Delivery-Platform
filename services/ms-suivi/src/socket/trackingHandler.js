const Position         = require('../models/Position');
const LivreurTracking  = require('../models/LivreurTracking');
const CommandeTracking = require('../models/CommandeTracking');
const { authenticateSocket } = require('../middleware/auth');

/**
 * Estimate ETA in minutes based on straight-line distance at 30 km/h average.
 * (GraphHopper road ETA would be ideal but requires an extra async call per update.)
 */
const estimateEta = (livreurLat, livreurLng, dropoffLat, dropoffLng) => {
  const R = 6371;
  const dLat = ((dropoffLat - livreurLat) * Math.PI) / 180;
  const dLng = ((dropoffLng - livreurLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((livreurLat * Math.PI) / 180) *
      Math.cos((dropoffLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((distKm / 30) * 60); // minutes at avg 30 km/h
};

const registerHandlers = (io) => {
  // ─── JWT auth for all socket connections ───────────────────────────────
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const { userId, role } = socket.user;
    console.log(`[Socket] Connected: ${userId} (${role}) — ${socket.id}`);

    // Auto-join livreur to their personal room
    if (role === 'LIVREUR') {
      socket.join(`livreur:${userId}`);
    }

    // ─── CLIENT subscribes to an order ─────────────────────────────────
    socket.on('tracking:subscribe', async ({ orderId }) => {
      if (!orderId) return;
      socket.join(`order:${orderId}`);

      // Send current snapshot immediately
      const tracking = await CommandeTracking.findOne({ idCommande: orderId }).lean();
      if (tracking) {
        socket.emit(`tracking:status:${orderId}`, tracking.statusCommande);
        if (tracking.etaMinutes !== null) {
          socket.emit(`tracking:eta:${orderId}`, { etaMinutes: tracking.etaMinutes });
        }
        if (tracking.routePolyline?.length) {
          socket.emit(`tracking:route:${orderId}`, tracking.routePolyline);
        }
      }

      // Send livreur's last known position
      if (tracking?.idLivreur) {
        const lv = await LivreurTracking.findOne({ idLivreur: tracking.idLivreur }).lean();
        if (lv?.location?.coordinates?.length === 2) {
          const [lng, lat] = lv.location.coordinates;
          socket.emit(`tracking:position:${orderId}`, { lat, lng, timestamp: lv.updatedAt });
        }
      }
    });

    // ─── CLIENT unsubscribes ────────────────────────────────────────────
    socket.on('tracking:unsubscribe', ({ orderId }) => {
      if (orderId) socket.leave(`order:${orderId}`);
    });

    // ─── LIVREUR sends GPS position ─────────────────────────────────────
    socket.on('livreur:position', async ({ lat, lng }) => {
      if (role !== 'LIVREUR') return;
      if (lat == null || lng == null) return;

      const livreurId = userId;
      const timestamp = new Date();

      // Persist position history
      await Position.create({
        idLivreur: livreurId,
        location: { type: 'Point', coordinates: [lng, lat] },
        timestamp,
      });

      // Update latest snapshot
      await LivreurTracking.findOneAndUpdate(
        { idLivreur: livreurId },
        {
          idLivreur: livreurId,
          location: { type: 'Point', coordinates: [lng, lat] },
          updatedAt: timestamp,
        },
        { upsert: true, new: true }
      );

      // Find all active orders for this livreur and broadcast position
      const activeOrders = await CommandeTracking.find({
        idLivreur: livreurId,
        statusCommande: { $in: ['ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'] },
      }).lean();

      for (const order of activeOrders) {
        const posPayload = { lat, lng, timestamp };
        io.to(`order:${order.idCommande}`).emit(
          `tracking:position:${order.idCommande}`,
          posPayload
        );

        // Update ETA
        if (order.dropoffLocation?.coordinates?.length === 2) {
          const [dropLng, dropLat] = order.dropoffLocation.coordinates;
          const etaMinutes = estimateEta(lat, lng, dropLat, dropLng);
          io.to(`order:${order.idCommande}`).emit(`tracking:eta:${order.idCommande}`, {
            etaMinutes,
          });
          await CommandeTracking.updateOne(
            { idCommande: order.idCommande },
            { etaMinutes, updatedAt: timestamp }
          );
        }
      }

      // Also broadcast to any admin watching the live dashboard
      io.to('admin:live').emit('livreur:position:update', { livreurId, lat, lng, timestamp });
    });

    // ─── ADMIN joins live dashboard ─────────────────────────────────────
    socket.on('admin:subscribe', () => {
      if (role === 'ADMIN') socket.join('admin:live');
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${userId} — ${reason}`);
    });
  });
};

module.exports = { registerHandlers };