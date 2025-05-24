const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth'); 
const upload = require("../middlewares/multer"); // Middleware for handling file uploads
const {
  addProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  getProduitBySearch,
  productstatusupdate
} = require("../controllers/product.controller");

router.post("/", auth(),upload.single("photoProduit"), addProduit);

router.get("/",  auth(),getAllProduits);
router.get("/name",  auth(),getProduitBySearch);
router.get("/:id", auth(), getProduitById);
router.put("/:id", auth(), updateProduit);

router.delete("/:id", auth(), deleteProduit);
router.put('/status/:id', auth(), productstatusupdate)
module.exports = router;
