const cloudinary = require("../config/cloudinary");
const Produit = require("../models/Produit");

const addProduit = async (req, res) => {
  try {
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

    const produit = await Produit.create({
      nomProduit: req.body.nomProduit,
      price: req.body.price,
      stock: req.body.stock || 0,
      description: req.body.description,
      photoProduit: uploadResult.secure_url,
      infos: req.body.infos,
      Catalogueid:req.body.Catalogueid
    });

    console.log("Product saved to MongoDB:", produit);
    res.status(201).json({ msg: "Product created successfully!", produit });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json(produits);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error });
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
    const produits = await Produit.find({Catalogueid:req.params.id});
    if (!produits) {
      return res.status(404).json({ message: "Products not found!" });
    }
    if( produits.length === 0){
      return res.status(200).json({ message: "No products found in this catalog." });
   }
    res.status(200).json(produit);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const updateProduit = async (req, res) => {
    try {
      let updateData = { ...req.body };
      if (updateData.Boutiqueid && !mongoose.Types.ObjectId.isValid(updateData.Boutiqueid)) {
        return res.status(400).json({ message: "Invalid Boutiqueid format" });
      }
  
      if (updateData.Boutiqueid) {
        updateData.Boutiqueid = new mongoose.Types.ObjectId(updateData.Boutiqueid);
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
};
