import mongoose from "mongoose";
const { Schema } = mongoose;

const LivreurSchema = new Schema({
    _id: {
        type: Number,  
        required: true
      },
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


export const Livreur = mongoose.model('Livreur', LivreurSchema);