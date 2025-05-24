const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createCommande,
  getAllCommandes,
  getCommandeById,
  updateCommandeStatus,
  deleteCommande,
  getCommandeByClientId,
  getCommandeByBoutiqueId
} = require("../controllers/Commande.controller");

// Create a new commande
router.post("/", auth(), createCommande);

// Get all commandes (possibly with filters)
router.get("/", auth(), getAllCommandes);

// Get commandes by client ID (added as a query parameter route)
router.get("/client/:clientId", auth(), getCommandeByClientId);
router.get("/boutique/:boutiqueId",auth(),getCommandeByBoutiqueId)

// Get a specific commande by ID
router.get("/:commandeId", auth(), getCommandeById);

// Update commande status
router.put("/:commandeId/status", auth(), updateCommandeStatus);

// Delete a commande
router.delete("/:commandeId", auth(), deleteCommande);

module.exports = router;