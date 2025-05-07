const express = require("express");
require("dotenv").config();
const axios = require('axios');
const connectDB = require("./config/db"); 
const app = express();
const PORT = process.env.PORT || 5010;
const {createCheckout,createPrice,createProduct}=require('./services/chargily.service')
const Produit=require('./models/produit')
const Paiment=require('./models/paiement')
const ProduitPaiment=require('./models/produitpaiement')
const getCommandeProducts=require("./services/ms-commandes.service");
const getLivPrice=require("./services/ms-suivi.service");
const getCommandeLiv=require("./services/ms-optimization.service");
const verifyToken=require("./services/ms-user.service");
const { calculateCommercentPrice, calculateLivraisonPrice } = require("./utils/calculate");
const {client,getServiceUrl} = require('./config/eureka-client');
const Commercent = require("./models/commercent");
const Livreur = require("./models/livreur");
const { Kafka } = require('kafkajs');


app.use(express.json());

app.post('/calculate_price',async(req,res)=>{

const token  = req.headers.authorization.split("Bearer ")[1];
console.log(req.headers.authorization.split("Bearer ")[1])
const roles = await verifyToken(token);
if (roles==false) {
    return res.status(403).json({ message: "Access denied" });  
}  
const { idCommande ,payment_method} = req.body;

// Get commande products
const {products,commande}= await getCommandeProducts(idCommande);

// Fetch all existing products from the database
let dbProduits = await Produit.findAll();
const existingIds = dbProduits.map(p => p.id); // Extract IDs

for (let product of products) {
    if (!existingIds.includes(product._id)) { // Corrected condition
        let chargily_id = await createProduct({name:product.produit.nomProduit,description:"description"});
        await Produit.create({ id: product._id, chargily_id });
    }
}

dbProduits=await Produit.findAll()


  // create payement table
const paiement=await Paiment.create({id_commande:idCommande})  

  // link product with payement table
const produitPaiement=dbProduits.map((p)=>{
  return {id_produit:p.id,id_paiement:paiement.id}
})

await ProduitPaiment.bulkCreate(produitPaiement)

  //get products {id_chargily,price}
   let productsPrices=products.map(product => {
    const dbProduct = dbProduits.find(p => p.id === product._id);
    return {
        price: product.produit.price,
        quantity:product.quantity,
        chargily_id: dbProduct ? dbProduct.chargily_id : null // Null si non trouvé
    };
});


  //get products {id_price,quantite}   

  let items = await Promise.all(productsPrices.map(async (p) => {
    const priceId = await createPrice({ amount: p.price, idProduit: p.chargily_id });
    return {
      quantity: p.quantity,
      price:priceId
    };
  }));
  const livreurId=await getCommandeLiv(commande['_id'])
  const livreur=await Livreur.findByPk(livreurId)



  //calculate livraison price and create id price
  console.log(commande)
  const livraison_price=await getLivPrice(commande)
  let livraison_id=await createProduct({name:"livraison"})
  let livraison_price_id=await createPrice({idProduit:livraison_id,price:livraison_price})
  paiement.prix_livraison=livraison_price
  if(livreur){
    livreur.revenu_total+=livraison_price
    await livreur.save()
    paiement.id_livreur=livreurId
  }



  //create checkout and calculate total price
  const commercent_price=calculateCommercentPrice(productsPrices)
  console.log(commercent_price)
  console.log(commande['_id'])
  //paiement.id_livreur=await getCommandeLiv(commande['_id'])

  paiement.prix_commercent=commercent_price
  paiement.prix_total=livraison_price+commercent_price
  
  const {checkout_url,id}=await createCheckout([...items,{price:livraison_price_id,quantity:1}],payment_method)
  paiement.checkout_url=checkout_url
  paiement.checkout_id=id
  await paiement.save()
  res.status(200).json({livraison_price,total:livraison_price+commercent_price,id:paiement.id})
  // return total price

})

app.post("/checkout/:id",async(req,res)=>{
  const  token = req.headers.authorization.split("Bearer ")[1];
  const roles = await verifyToken(token);
  if (roles == false || !roles.includes("CLIENT")) {
    return res.status(403).json({ message: "Access denied" });
  }
  const id = req.params.id;
  const paiement=await Paiment.findByPk(id)
  res.redirect(paiement.checkout_url)
})
app.get("/failure",async(req,res)=>{
  console.log(req.query.checkout_id)
  
  await Paiment.update({status:"failed"},{where:{checkout_id:req.query.checkout_id}})
  //res.send("failure "+req.query.checkout_id)
  res.redirect("myapp://payment-failure")
})
app.get("/success",async(req,res)=>{
  console.log(req.query.checkout_id)
  await Paiment.update({status:"success"},{where:{checkout_id:req.query.checkout_id}})
  res.redirect("myapp://payment-success")
  //res.send("success "+req.query.checkout_id)
})

const sequelize = require('./config/db');
sequelize.sync({ force: true }) // Mettre `true` pour recréer les tables à chaque lancement
    .then(async() =>{ console.log('✅ Tables synchronisées')
    }
)
    .catch(err => console.error('❌ Erreur de synchronisation:', err));


    





//webhook success

//webhook failure

app.get('/getCommercent/:id',async(req,res)=>{
  try {
  const id = req.params.id;
  const commercent=await Commercent.findByPk(id)
  res.status(200).json({commercent})
  }catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
}
)

app.get('/getLivreur/:id',async(req,res)=>{
  try {
  const id = req.params.id;
  const livreur=await Livreur.findByPk(id)
  res.status(200).json({livreur})
  }catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
})


app.get('/info', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/get', (req, res) => {
  console.log(getServiceUrl("ms-gateway"))
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  client.start(); 
});


const kafka = new Kafka({
  clientId: 'my-express-app',
  brokers: ['localhost:9092'], // Change this to your Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'commercent', fromBeginning: true });
  await consumer.subscribe({ topic: 'livreur', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
       console.log(message.value.toString())
      if(topic=="commercent"){ 
      const data = JSON.parse(message.value.toString());
      const commercentId = data.commercentId;
      const commercent=await Commercent.findByPk(commercentId);
      if (!commercent) {
        await Commercent.create({id:commercentId})
      } 
     } else if(topic=="livreur"){
      const data = JSON.parse(message.value.toString());
      const livreurId = data.livreurId;
      const livreur=await Livreur.findByPk(livreurId);
      if (!livreur) {
        await Livreur.create({id:livreurId})
      } 
     }

    },
  });
};


startConsumer().catch(console.error);
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