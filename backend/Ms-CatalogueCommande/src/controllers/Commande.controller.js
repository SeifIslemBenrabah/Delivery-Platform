const Commande = require("../models/Commande");
const Produit = require('../models/Produit');
const {Boutique} = require("../models/Boutique");
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require('axios');
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
    let { PickUpAddress, DropOffAddress, Livraisontype, idClient, produits } = req.body;

    if (!DropOffAddress || !Livraisontype || !idClient || !produits) {
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

    // Validate and format product data
    const formattedProduits = produits.map((item) => {
      if (!mongoose.Types.ObjectId.isValid(item.produit)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.produit}` });
      }
      return {
        produit: new mongoose.Types.ObjectId(item.produit),
        quantity: item.quantity
      };
    });

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
    const cartApiUrl=`http://localhost:8020/new_order`; //`http://${hostName}:${port2}/service-optimization/new_order`;

    await axios.post(cartApiUrl, {
      idCommande: newCommande.id,
      depart: [PickUpAddress.latitude, PickUpAddress.longitude],
      arrivee: [DropOffAddress.latitude, DropOffAddress.longitude]
    });

    res.status(201).json({ message: "Commande created successfully!", commande: newCommande });

  } catch (error) {
    console.error("Error creating Commande:", error);
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
const getCommandeByBoutiqueId = async (req,res)=>{
  const { boutiqueId } = req.params;
  try{
    if (!boutiqueId) {
      return res.status(400).json({
          success: false,
          message: "Client ID is required"
      });
  }
  const commandes = await Commande.find({ idBoutique: boutiqueId }).sort({ date: -1 });
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
  getCommandeByClientId,
  getCommandeByBoutiqueId
};
