const mongoose = require('mongoose');
const { Schema } = mongoose;

const TypeSchema = new Schema({
    typeName: { type: String },
    typeValue: { type: String},
}, { _id: false });

const ProduitSchema = new Schema({
    nomProduit: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String },
    photoProduit:{type: String, required: true},
    infos: [TypeSchema] ,
    Catalogueid: { type: Schema.Types.ObjectId, ref: 'Catalogue', required: true },
    status: {
        type: String,
        enum: ['accepte', 'refuse', 'en_attente'],
        default: 'en_attente'
    },
    idBoutique: { type: String, ref: "Boutique", required: true },
    idCommercant: { type: String, ref: "Boutique",required: true }
}, { timestamps: true });

const Produit = mongoose.model("Produit", ProduitSchema);
module.exports = Produit;
