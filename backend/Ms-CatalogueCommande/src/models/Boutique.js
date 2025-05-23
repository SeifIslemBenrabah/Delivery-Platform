const mongoose = require('mongoose');
const { Schema } = mongoose;

const CatalogueSchema = new Schema({
    nomCatalogue: { type: String, required: true },
    produits: [{ type: Schema.Types.ObjectId, ref: 'Produit' }] 
});

const BoutiqueSchema = new Schema({
    _id:{type:String , required: true },
    nomBoutique: { type: String, required: true },
    description:{ type: String},
    address: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        name:{type:String , required: true}
    },
    phone:{type:String , required: true},
    status: {
        type: String,
        enum: ['accepte', 'refuse', 'en_attente'],
        default: 'en_attente'
    },
    photo: { type: String, required: false },
    idCommercant: { type: String, required: true },
    catalogues: [CatalogueSchema], 
});

const Boutique = mongoose.model("Boutique", BoutiqueSchema);
module.exports = { Boutique }; 
