const mongoose = require('mongoose');

const commandeTrackingSchema = new mongoose.Schema({
  idCommande:     { type: String, required: true, unique: true },
  idLivreur:      { type: String, index: true },
  idClient:       { type: String, index: true },
  statusCommande: { type: String, default: 'PENDING' },
  pickupLocation: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  dropoffLocation: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  // Optimized route polyline from ms-optimisation
  routePolyline:  { type: [[Number]], default: [] },
  // ETA in minutes (updated when livreur sends position)
  etaMinutes:     { type: Number, default: null },
  updatedAt:      { type: Date, default: Date.now },
}, { _id: false });

commandeTrackingSchema.index({ pickupLocation: '2dsphere' });
commandeTrackingSchema.index({ dropoffLocation: '2dsphere' });

module.exports = mongoose.model('CommandeTracking', commandeTrackingSchema);