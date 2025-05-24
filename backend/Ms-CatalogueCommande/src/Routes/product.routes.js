const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer"); // Middleware for handling file uploads
const {
  addProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  getProduitBySearch,
} = require("../controllers/product.controller");

router.post("/", auth(), upload.single("photoProduit"), addProduit);

router.get("/", getAllProduits);
router.get("/name", getProduitBySearch);
router.get("/:id", getProduitById);
router.put("/:id", updateProduit);

router.delete("/:id", deleteProduit);
module.exports = router;
