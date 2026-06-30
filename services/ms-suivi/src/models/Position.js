const mongoose = require('mongoose');

const TTL_SECONDS = parseInt(process.env.POSITION_TTL_HOURS || '24') * 3600;

const positionSchema = new mongoose.Schema({
  idLivreur: { type: String, required: true, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  timestamp: { type: Date, default: Date.now },
}, { _id: true });

// 2dsphere index for geospatial queries
positionSchema.index({ location: '2dsphere' });
// TTL index — positions auto-deleted after 24h
positionSchema.index({ timestamp: 1 }, { expireAfterSeconds: TTL_SECONDS });

module.exports = mongoose.model('Position', positionSchema);