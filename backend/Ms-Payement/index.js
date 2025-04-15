const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db"); 
const app = express();
const PORT = process.env.PORT || 5000;
const {createCheckout,createPrice,createProduct}=require('./services/chargily.service')
const Produit=require('./models/produit')
const Paiment=require('./models/paiement')
const ProduitPaiment=require('./models/produitpaiement')
const getCommandeProducts=require("./services/ms_commandes.service");
const { calculateCommercentPrice, calculateLivraisonPrice } = require("./utils/calculate");

app.use(express.json());

app.post('/calculate_price',async(req,res)=>{

const { idCommande ,payment_method} = req.body;

// Get commande products
const products = await getCommandeProducts(idCommande);

// Fetch all existing products from the database
let dbProduits = await Produit.findAll();
const existingIds = dbProduits.map(p => p.id); // Extract IDs

for (let product of products) {
    if (!existingIds.includes(product._id)) { // Corrected condition
        let chargily_id = await createProduct({name:product.produit.name,description:product.produit.description});
        await Produit.create({ id: product._id, chargily_id });
    }
}

dbProduits=await Produit.findAll()
  

  // create payement table
const paiement=await Paiment.create({id_commande:idCommande})  

  // link product with payement table
const produitPaiement=dbProduits.map((p)=>{
  return {id_produit:p.id,id_paiment:paiement.id}
})

await ProduitPaiment.bulkCreate(produitPaiement)

  //get products {id_chargily,price}
   let productsPrices=products.map(product => {
    const dbProduct = dbProduits.find(p => p.idProduit === product._id);
    return {
        price: product.produit.price,
        quantity:product.quantity,
        chargily_id: dbProduct ? dbProduct.chargily_id : null // Null si non trouvé
    };
});

  //get products {id_price,quantite}   

let items=productsPrices.map(async(p)=>{
    const priceId=await createPrice({idProduit:p.chargily_id})
    return {
      quantity:p.quantity,priceId
    }
})
  //calculate livraison price and create id price
  const livraison_price=calculateLivraisonPrice()
  let livraison_id=await createProduct({name:"livraison"})
  let livraison_price_id=await createPrice({product_id:livraison_id,price:livraison_price})
  paiement.prix_livraison=livraison_price
  //create checkout and calculate total price
  const commercent_price=calculateCommercentPrice(productsPrices)
  paiement.prix_commercent=commercent_price
  paiement.prix_total=livraison_price+commercent_price
  const checkout_url=await createCheckout([...items,{priceId:livraison_price_id}],payment_method)
  paiement.checkout_url=checkout_url
  await paiement.save()
  res.status(200).json({livraison_price,total:livraison_price+commercent_price})
  // return total price
})

app.post("/checkout/:id",async(req,res)=>{
  const id = req.params.id;
  const paiement=await Paiment.findByPk(id)
  res.redirect(paiement.checkout_url)
})

const sequelize = require('./config/db');
sequelize.sync({ force: true }) // Mettre `true` pour recréer les tables à chaque lancement
    .then(async() =>{ console.log('✅ Tables synchronisées')
    }
)
    .catch(err => console.error('❌ Erreur de synchronisation:', err));

import bodyParser from 'body-parser';
import { verifySignature } from '@chargily/chargily-pay';

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.post('/webhook', (req, res) => {
  const signature = req.get('signature') || '';
  const payload = req.rawBody;

  if (!signature) {
    console.log('Signature header is missing');
    res.sendStatus(400);
    return;
  }

  try {
    if (!verifySignature(payload, signature, API_SECRET_KEY)) {
      console.log('Signature is invalid');
      res.sendStatus(403);
      return;
    }
  } catch (error) {
    console.log(
      'Something happened while trying to process the request to the webhook'
    );
    res.sendStatus(403);
    return;
  }

  const event = req.body;
  // You can use the event.type here to implement your own logic
  console.log(event);

  res.sendStatus(200);
});

//webhook success

//webhook failure

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*

le debut
la commande est confirme 
l'app mobile demande le prix total
backend calcule le prix et cree le chekcout url
app mobile envoie une requete de paiment 
backend redirige vers charigily pay
success 
backend add money to commercent account
backend add money to livreur count 
backend add money to owner count 
redirect vers app 
failure 
backend redirect vers app S
*/