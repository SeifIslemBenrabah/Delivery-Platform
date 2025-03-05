const mongoose = require('mongoose');
const { Schema } = mongoose;

const CatalogueSchema = new Schema({
    nomCatalogue: { type: String, required: true },
    produits: [{ type: Schema.Types.ObjectId, ref: 'Produit' }] 
});

const BoutiqueSchema = new Schema({
    nomBoutique: { type: String, required: true },
    address: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    photo: { type: String, required: false },
    idCommercant: { type: String, required: true },
    catalogues: [CatalogueSchema], 
});

const Boutique = mongoose.model("Boutique", BoutiqueSchema);
module.exports = { Boutique }; 
