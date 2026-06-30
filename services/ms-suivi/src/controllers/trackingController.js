const LivreurTracking  = require('../models/LivreurTracking');
const CommandeTracking = require('../models/CommandeTracking');
const Position         = require('../models/Position');

// GET /api/tracking/order/:orderId
const getOrderTracking = async (req, res, next) => {
  try {
    const tracking = await CommandeTracking.findOne({
      idCommande: req.params.orderId,
    }).lean();
    if (!tracking) return res.status(404).json({ error: 'Commande non trouvée' });

    // Attach latest livreur position
    let livreurPosition = null;
    if (tracking.idLivreur) {
      const lv = await LivreurTracking.findOne({ idLivreur: tracking.idLivreur }).lean();
      if (lv?.location?.coordinates?.length === 2) {
        livreurPosition = {
          lat: lv.location.coordinates[1],
          lng: lv.location.coordinates[0],
          updatedAt: lv.updatedAt,
        };
      }
    }

    res.json({ ...tracking, livreurPosition });
  } catch (err) { next(err); }
};

// GET /api/tracking/livreur/:livreurId
const getLivreurPosition = async (req, res, next) => {
  try {
    const lv = await LivreurTracking.findOne({ idLivreur: req.params.livreurId }).lean();
    if (!lv) return res.status(404).json({ error: 'Livreur non trouvé' });
    const [lng, lat] = lv.location.coordinates;
    res.json({ idLivreur: lv.idLivreur, lat, lng, availability: lv.availability, updatedAt: lv.updatedAt });
  } catch (err) { next(err); }
};

// GET /api/tracking/livreur/:livreurId/history
const getPositionHistory = async (req, res, next) => {
  try {
    const since = req.query.since
      ? new Date(req.query.since)
      : new Date(Date.now() - 3 * 3600 * 1000); // last 3 hours by default

    const positions = await Position.find({
      idLivreur: req.params.livreurId,
      timestamp: { $gte: since },
    })
      .sort({ timestamp: 1 })
      .lean();

    res.json(
      positions.map((p) => ({
        lat: p.location.coordinates[1],
        lng: p.location.coordinates[0],
        timestamp: p.timestamp,
      }))
    );
  } catch (err) { next(err); }
};

// GET /api/tracking/live  (admin — all active livreurs)
const getLiveSnapshot = async (req, res, next) => {
  try {
    const livreurs = await LivreurTracking.find({ availability: true }).lean();
    res.json(
      livreurs.map((lv) => ({
        idLivreur:   lv.idLivreur,
        lat:         lv.location.coordinates[1],
        lng:         lv.location.coordinates[0],
        availability:lv.availability,
        updatedAt:   lv.updatedAt,
      }))
    );
  } catch (err) { next(err); }
};

module.exports = { getOrderTracking, getLivreurPosition, getPositionHistory, getLiveSnapshot };