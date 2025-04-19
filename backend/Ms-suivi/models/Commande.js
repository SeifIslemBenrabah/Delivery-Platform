import mongoose from "mongoose";
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

export const Commande = mongoose.model('Commande', CommandeSchema);