const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommandeSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    PickUpAddress: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    DropOffAddress: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    statusCommande: {
        type: String,
        enum: ["En cours", "Validée", "Annulée","en livraison","Livré"], 
        default: "En cours"
    },
    Livraisontype: {
        type: String,
        enum: ["Express", "Standard"],
        default: "Standard",
        required: true
    },
    idClient: {
        type: String, 
        required: true
    },
    produits: [{
        produit: { type: Schema.Types.ObjectId, ref: "Produit", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
});

const Commande = mongoose.model("Commande", CommandeSchema);
module.exports = Commande;
