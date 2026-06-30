const mongoose = require('mongoose');

// Stores the LATEST known position of each livreur (upserted on every update)
const livreurTrackingSchema = new mongoose.Schema({
  idLivreur:    { type: String, required: true, unique: true },
  availability: { type: Boolean, default: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

livreurTrackingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LivreurTracking', livreurTrackingSchema);