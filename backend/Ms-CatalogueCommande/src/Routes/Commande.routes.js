const express = require("express");
const router = express.Router();
const {
  createCommande,
  getAllCommandes,
  getCommandeById,
  updateCommandeStatus,
  deleteCommande,
  getCommandeByClientId 
} = require("../controllers/Commande.controller");

// Create a new commande
router.post("/", createCommande);

// Get all commandes (possibly with filters)
router.get("/", getAllCommandes);

// Get commandes by client ID (added as a query parameter route)
router.get("/client/:clientId", getCommandeByClientId);

// Get a specific commande by ID
router.get("/:commandeId", getCommandeById);

// Update commande status
router.put("/:commandeId/status", updateCommandeStatus);

// Delete a commande
router.delete("/:commandeId", deleteCommande);

module.exports = router;