const express = require("express");
const router = express.Router();
const {
  createCommande,
  getAllCommandes,
  getCommandeById,
  updateCommandeStatus,
  deleteCommande,
} = require("../controllers/Commande.controller");

router.post("/", createCommande);

router.get("/", getAllCommandes);


router.get("/:commandeId", getCommandeById);

router.put("/:commandeId/status", updateCommandeStatus);

router.delete("/:commandeId", deleteCommande);

module.exports = router;
