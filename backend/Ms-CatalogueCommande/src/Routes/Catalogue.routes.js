const express = require("express");
const router = express.Router();
const catalogueController = require("../controllers/Catalogue.controlller");
const {getProduitByIdCatalogue} = require("../controllers/product.controller")
router.get("/:boutiqueId/catalogues", catalogueController.getCataloguesByBoutique);
router.post("/:boutiqueId/catalogues", catalogueController.addCatalogueToBoutique);
router.get("/:boutiqueId/catalogues/:catalogueId/produits", getProduitByIdCatalogue);
router.put("/:boutiqueId/catalogues/:catalogueId", catalogueController.updateCatalogueInBoutique);
router.delete("/:boutiqueId/catalogues/:catalogueId", catalogueController.deleteCatalogueFromBoutique);


module.exports = router;
