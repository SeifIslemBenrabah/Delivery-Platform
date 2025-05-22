const express = require("express");
const auth = require('../middlewares/auth'); 
const router = express.Router();
const catalogueController = require("../controllers/Catalogue.controlller");
const {getProduitByIdCatalogue} = require("../controllers/product.controller")
router.get("/:boutiqueId/catalogues",auth(), catalogueController.getCataloguesByBoutique);
router.post("/:boutiqueId/catalogues",auth(), catalogueController.addCatalogueToBoutique);
router.get("/:boutiqueId/catalogues/:catalogueId/produits",auth(), getProduitByIdCatalogue);
router.put("/:boutiqueId/catalogues/:catalogueId",auth(), catalogueController.updateCatalogueInBoutique);
router.delete("/:boutiqueId/catalogues/:catalogueId",auth(), catalogueController.deleteCatalogueFromBoutique);


module.exports = router;
