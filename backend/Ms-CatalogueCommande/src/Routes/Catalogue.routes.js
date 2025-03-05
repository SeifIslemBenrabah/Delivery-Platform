const express = require("express");
const router = express.Router();
const catalogueController = require("../controllers/Catalogue.controlller");

router.get("/:boutiqueId/catalogues", catalogueController.getCataloguesByBoutique);
router.post("/:boutiqueId/catalogues", catalogueController.addCatalogueToBoutique);
router.put("/:boutiqueId/catalogues/:catalogueId", catalogueController.updateCatalogueInBoutique);
router.delete("/:boutiqueId/catalogues/:catalogueId", catalogueController.deleteCatalogueFromBoutique);

module.exports = router;
