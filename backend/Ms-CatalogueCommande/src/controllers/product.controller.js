const cloudinary = require("../config/cloudinary");
const Produit = require("../models/Produit");
const {Boutique} = require("../models/Boutique");
const mongoose = require("mongoose");

const addProduit = async (req, res) => {
  try {
    // if (!req.user.roles.includes('COMMERCANT')) {
    //   return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    // }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    console.log("Uploading image to Cloudinary...");
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: `products/${req.file.originalname.split(".")[0]}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    console.log("Image uploaded:", uploadResult.secure_url);
    const boutique = await Boutique.findOne({ "catalogues._id": req.body.Catalogueid });
      if (!boutique) {
        console.log(req.body.Catalogueid );
        return res.status(404).json({ message: `Boutique not found to add product` });
      }
      if(boutique._id !== req.body.Boutiqueid){
        return res.status(400).json({ message: `catalogue must belong to the same boutique` });
      }
      idCommercent = boutique.idCommercant; 
    const produit = await Produit.create({
      nomProduit: req.body.nomProduit,
      price: req.body.price,
      stock: req.body.stock || 0,
      description: req.body.description,
      photoProduit: uploadResult.secure_url,
      infos: req.body.infos,
      Catalogueid:req.body.Catalogueid,
      idBoutique: req.body.Boutiqueid,
      idCommercant:req.body.idCommercant
    });

    console.log("Product saved to MongoDB:", produit);
    res.status(201).json({ msg: "Product created successfully!", produit });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const productstatusupdate = async (req,res)=>{
  try{
    if (!req.user.roles.includes('ADMIN')) {
      return res.status(403).json({ message: "Access denied. Not a ADMIN." });
    }
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const { statusProduct } = req.body;

    if (!['accepte', 'refuse', 'en_attente'].includes(statusProduct)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const updatedProduct = await Produit.findByIdAndUpdate(
      req.params.id,
      { status:statusProduct },
      { new: true }
    );

    res.status(200).json({ message: "Product status updated!", Product: updatedProduct });
  }catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
}
const getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find().populate({
      path: 'idBoutique',
      select: 'nomBoutique' // only include the boutique name
    });
    res.status(200).json(produits);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const getProduitBySearch = async (req, res) => {
  try {
    const searchTerm = req.query.search?.trim();

    if (!searchTerm) {
      return res.status(400).json({ msg: "What are you searching for?" });
    }

    const produits = await Produit.find({
      nomProduit: { $regex: new RegExp(searchTerm, "i") } 
    });
    if (produits.length === 0) {
      return res.status(404).json({ msg: "There is no product with this name." });
    }
    return res.status(200).json(produits);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.status(200).json(produit);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const getProduitByIdCatalogue = async (req, res) => {
  try {
    const { boutiqueId, catalogueId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(boutiqueId)) {
      return res.status(400).json({ msg: "Invalid boutique ID format." });
    }
    if (!mongoose.Types.ObjectId.isValid(catalogueId)) {
      return res.status(400).json({ msg: "Invalid catalogue ID format." });
    }
    const boutique = await Boutique.findById(new mongoose.Types.ObjectId(boutiqueId));

    if (!boutique) {
      return res.status(404).json({ msg: "Boutique not found." });
    }
    const catalogue = boutique.catalogues.find(cat => cat._id.toString() === catalogueId);

    if (!catalogue) {
      return res.status(404).json({ msg: "Catalogue not found." });
    }
    const produits = await Produit.find({ catalogueId });

    if (produits.length === 0) {
      return res.status(200).json({ message: "No products found in this catalog." });
    }

    return res.status(200).json(produits);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateProduit = async (req, res) => {
    try {
      if (!req.user.roles.includes('COMMERCANT')) {
        return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
      }
      let updateData = { ...req.body };
      if (updateData.Boutiqueid && !mongoose.Types.ObjectId.isValid(updateData.Boutiqueid)) {
        return res.status(400).json({ message: "Invalid Boutiqueid format" });
      }
      
  
      if (updateData.infos) {
        try {
          updateData.infos = JSON.parse(updateData.infos);
        } catch (error) {
          return res.status(400).json({ message: "Invalid JSON format in infos" });
        }
      }
      if (req.file) {
        console.log("Uploading new image to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { public_id: `products/${req.file.originalname.split(".")[0]}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        console.log("New image uploaded:", uploadResult.secure_url);
        updateData.photoProduit = uploadResult.secure_url; // Save new image URL
      }
      const produit = await Produit.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!produit) {
        return res.status(404).json({ message: "Product not found!" });
      }
      res.status(200).json({ msg: "Product updated successfully!", produit });
  
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  

const deleteProduit = async (req, res) => {
  try {
    if (!req.user.roles.includes('COMMERCANT')) {
      return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    }
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  getProduitBySearch,
  getProduitByIdCatalogue,
  productstatusupdate
};
