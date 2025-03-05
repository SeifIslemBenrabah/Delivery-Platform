const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer"); // Middleware for handling file uploads
const {
  addProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
} = require("../controllers/product.controller");

router.post("/", upload.single("photoProduit"), addProduit);

router.get("/", getAllProduits);

router.get("/:id", getProduitById);

router.put("/:id", updateProduit);

router.delete("/:id", deleteProduit);

module.exports = router;
