const Commande = require("../models/Commande");
const mongoose = require("mongoose");
const createCommande = async (req, res) => {
  try {
    const {
      PickUpAddress,
      DropOffAddress,
      Livraisontype,
      idClient,
      produits,
    } = req.body;

    if (!PickUpAddress || !DropOffAddress || !Livraisontype || !idClient || !produits) {
      return res.status(400).json({ message: "Missing required fields!" });
    }
    const formattedProduits = produits.map((item) => {
        if (!mongoose.Types.ObjectId.isValid(item.produit)) {
          throw new Error(`Invalid product ID: ${item.produit}`);
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
    });

    
    await newCommande.save();

    res.status(201).json({ message: "Commande created successfully!", commande: newCommande });
  } catch (error) {
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
};
