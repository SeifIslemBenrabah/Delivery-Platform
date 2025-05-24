const {Boutique} = require("../models/Boutique");


const getCataloguesByBoutique = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.boutiqueId);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }
    res.status(200).json(boutique.catalogues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCatalogueToBoutique = async (req, res) => {
  try {

    // if (!req.user.roles.includes('COMMERCANT')) {
    //   return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    // }
    const { boutiqueId } = req.params;
    const { nomCatalogue, produits } = req.body; 

    const boutique = await Boutique.findById( boutiqueId);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    const newCatalogue = { nomCatalogue, produits };

    boutique.catalogues.push(newCatalogue);
    await boutique.save();

    res.status(201).json({ message: "Catalogue added successfully", boutique });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCatalogueInBoutique = async (req, res) => {
  try {
    if (!req.user.roles.includes('COMMERCANT')) {
      return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    }
    const { boutiqueId, catalogueId } = req.params;
    const { nomCatalogue, produits } = req.body;

    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    const catalogue = boutique.catalogues.id(catalogueId);
    if (!catalogue) {
      return res.status(404).json({ message: "Catalogue not found" });
    }

    catalogue.nomCatalogue = nomCatalogue;
    catalogue.produits = produits;
    await boutique.save();

    res.status(200).json({ message: "Catalogue updated successfully", boutique });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCatalogueFromBoutique = async (req, res) => {
  try {
    if (!req.user.roles.includes('COMMERCANT')) {
      return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    }
    const { boutiqueId, catalogueId } = req.params;

    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    boutique.catalogues = boutique.catalogues.filter(catalogue => catalogue._id.toString() !== catalogueId);
    await boutique.save();

    res.status(200).json({ message: "Catalogue deleted successfully", boutique });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCataloguesByBoutique,
  addCatalogueToBoutique,
  updateCatalogueInBoutique,
  deleteCatalogueFromBoutique
};
