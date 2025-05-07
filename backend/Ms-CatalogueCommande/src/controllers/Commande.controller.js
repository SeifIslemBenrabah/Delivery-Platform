const Commande = require("../models/Commande");
const Produit = require('../models/Produit');
const {Boutique} = require("../models/Boutique");
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require('axios');
const { Eureka } = require('eureka-js-client');
//const client = require('../index')
const PORT = process.env.PORT || 5050;
const client = new Eureka({
  instance: {
    app: 'ms-commande',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': PORT,
      '@enabled': true
    },
    vipAddress: 'ms-commande',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8888,
    servicePath: '/eureka/apps/',
  },
});
client.start((error) => {
  if (error) {
    console.error('Eureka registration failed:', error);
  } else {
    console.log('✅ Registered with Eureka!');
  }
});
async function getUserDetails(userId) {
  try {
      const response = await axios.get(`http://localhost:5001/users/${userId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
  }
}
const createCommande = async (req, res) => {
  try {
    let { PickUpAddress, DropOffAddress, Livraisontype, idClient, produits } = req.body;

    if (!DropOffAddress || !Livraisontype || !idClient || !produits) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    // Fetch user details if PickUpAddress is not provided
    if (!PickUpAddress) {
      const userDetails = await getUserDetails(idClient);
      if (!userDetails || !userDetails.PickUpAddress) {
        return res.status(400).json({ message: "Invalid client ID or missing PickUpAddress!" });
      }
      PickUpAddress = userDetails.PickUpAddress;
    }

    // Validate product IDs
    const formattedProduits = [];
    let expectedBoutiqueId = null;
    let idCommercant = null;

    for (const item of produits) {
      const { produit, quantity, infos } = item;

      if (!mongoose.Types.ObjectId.isValid(produit)) {
        return res.status(400).json({ message: `Invalid product ID: ${produit}` });
      }

      const productDoc = await Produit.findById(produit);
      if (!productDoc) {
        return res.status(404).json({ message: `Product not found: ${produit}` });
      }

      // Find the boutique through the product's catalogue
      const boutique = await Boutique.findOne({ "catalogues._id": productDoc.Catalogueid });
      if (!boutique) {
        console.log(productDoc.Catalogueid);
        return res.status(404).json({ message: `Boutique not found for product: ${produit}` });
      }

      if (!expectedBoutiqueId) {
        expectedBoutiqueId = boutique._id.toString();
        idCommercant = boutique.idCommercant; 
      } else if (expectedBoutiqueId !== boutique._id.toString()) {
        return res.status(400).json({ message: "All products must belong to the same boutique." });
      }

      formattedProduits.push({
        produit: new mongoose.Types.ObjectId(produit),
        quantity,
        infos
      });
    }

    // Proceed with command creation
    const newCommande = new Commande({
      PickUpAddress,
      DropOffAddress,
      Livraisontype,
      idClient,
      produits: formattedProduits,
      idBoutique: expectedBoutiqueId,
      idCommercant
    });

    await newCommande.save();

    const instances = client.getInstancesByAppId('MS-GATEWAY');
    if (!instances || instances.length === 0) {
      return res.status(503).json({ message: "cart-api not available" });
    }

    const { hostName, port } = instances[0];
    const port2 = port['$'];
    const cartApiUrl = `http://${hostName}:${port2}/service-optimization/new_order`;

    await axios.post(cartApiUrl, {
      idCommande: newCommande.id,
      depart: [PickUpAddress.latitude, PickUpAddress.longitude],
      arrivee: [DropOffAddress.latitude, DropOffAddress.longitude]
    });

    res.status(201).json({ message: "Commande created successfully!", commande: newCommande });

  } catch (error) {
    console.error("Error creating Commande:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().populate("produits.produit");
    res.status(200).json({ commandes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCommandeById = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const commande = await Commande.findById(commandeId).populate("produits.produit");

    if (!commande) {
      return res.status(404).json({ message: "Commande not found!" });
    }

    res.status(200).json({ commande });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getCommandeByClientId = async (req,res)=>{
  const { clientId } = req.params;
  try{
    if (!clientId) {
      return res.status(400).json({
          success: false,
          message: "Client ID is required"
      });
  }
  const commandes = await Commande.find({ idClient: clientId }).sort({ date: -1 });
  res.status(200).json({
    success: true,
    data: commandes
});
  }catch(error){
    console.error('Error fetching client commands:', error);
    res.status(500).json({
        success: false,
        message: "Server error while fetching commands",
        error: error.message
    });
  }
}
const updateCommandeStatus = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const { statusCommande } = req.body;

    if (!["En cours", "Validée", "Annulée"].includes(statusCommande)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const updatedCommande = await Commande.findByIdAndUpdate(
      commandeId,
      { statusCommande },
      { new: true }
    );

    if (!updatedCommande) {
      return res.status(404).json({ message: "Commande not found!" });
    }

    res.status(200).json({ message: "Commande status updated!", commande: updatedCommande });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCommande = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const deletedCommande = await Commande.findByIdAndDelete(commandeId);

    if (!deletedCommande) {
      return res.status(404).json({ message: "Commande not found!" });
    }

    res.status(200).json({ message: "Commande deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCommande,
  getAllCommandes,
  getCommandeById,
  updateCommandeStatus,
  deleteCommande,
  getCommandeByClientId
};
