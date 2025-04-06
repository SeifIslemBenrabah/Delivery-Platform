const mongoose = require('mongoose');
const { Schema } = mongoose;

// 🔹 Commande Schema
const CommandeSchema = new Schema({
    idClient: { 
        type: Schema.Types.ObjectId, 
        ref: "Client",
        required: true,
        index: true
    },
    idLivreur: { 
        type: Schema.Types.ObjectId, 
        ref: "Livreur",
        required: false,
        index: true
    },
    dropLocation: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
        index: true
    },
    createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

const LivreurSchema = new Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    availability: {
        type: Boolean,
        required: true,
        default: true,
        index: true
    },
    commandes: [{
        type: Schema.Types.ObjectId,
        ref: 'Commande'
    }],
    lastUpdate: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

const Commande = mongoose.model('Commande', CommandeSchema);
const Livreur = mongoose.model('Livreur', LivreurSchema);

module.exports = { Commande, Livreur };
