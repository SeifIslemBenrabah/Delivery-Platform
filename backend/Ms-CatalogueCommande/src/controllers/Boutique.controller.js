const cloudinary = require("../config/cloudinary");
const {Boutique} = require("../models/Boutique");

const addBoutique = async (req, res) => {
  try {
    if (!req.user.roles.includes('COMMERCANT')) {
      return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    console.log("Uploading image to Cloudinary...");
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: `boutiques/${req.file.originalname.split(".")[0]}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    console.log("Image uploaded:", uploadResult.secure_url);

    const boutique = await Boutique.create({
      _id:req.body.id,
      description:req.body.description,
      nomBoutique: req.body.nomBoutique,
      address: req.body.address,
      photo: uploadResult.secure_url,
      idCommercant: req.body.idCommercant,
      phone:req.body.phone
    });

    console.log(" Boutique saved to MongoDB:", boutique);
    res.status(201).json({ msg: "Boutique created successfully!", boutique });

  } catch (error) {
    console.error(" Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const boutiquestatusupdate = async (req, res) => {
  try {
    if (!req.user.roles.includes('ADMIN')) {
      return res.status(403).json({ message: "Access denied. Not an ADMIN." });
    }

    const boutique = await Boutique.findById(req.params.id);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found!" });
    }

    const { statusBoutique } = req.body;
    if (!['accepte', 'refuse', 'en_attente'].includes(statusBoutique)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const updatedBoutique = await Boutique.findByIdAndUpdate(
      req.params.id,
      { status: statusBoutique },
      { new: true }
    );

    res.status(200).json({ message: "Boutique status updated!", boutique: updatedBoutique });
  } catch (error) {
    console.error("Error updating boutique status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllBoutiques = async (req, res) => {
    try {
      const boutiques = await Boutique.find();
      res.status(200).json(boutiques);
    } catch (error) {
      console.error(" Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  const getBoutiqueBystatus = async (req, res) => {
    try {
      const { status } = req.query;;  // extract status correctly
      // Validate status if you want, optional
      const validStatuses = ['accepte', 'refuse', 'en_attente'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status parameter" });
      }
  
      const boutiques = await Boutique.find({ status }); // filter by status
  
      res.status(200).json(boutiques);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  const getBoutiqueById = async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);
      if (!boutique) {
        return res.status(404).json({ message: "Boutique not found" });
      }
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
      }
  
      const url = `http://localhost:8082/api/v1/auth/users/${boutique.idCommercant}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ message: "Failed to fetch user info" });
      }
  
      const user = await response.json();

      return res.status(200).json({boutique,user});

    } catch (error) {
      console.error(" Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  const getBoutiqueByIdCommercant = async (req, res) => {
    try {
        const boutiques = await Boutique.find({ idCommercant: req.params.id });

        if (!boutiques) {
          return res.status(404).json({ message: "This Commercant doesn't have any Boutique" });
        }
        if( boutiques.length === 0){
           return res.status(200).json({ message: "This Commercant doesn't have any Boutique" });
        }
      res.status(200).json(boutiques);
    } catch (error) {
      console.error(" Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  const updateBoutique = async (req, res) => {
    try {
      const { nomBoutique, address, idCommercant } = req.body;
      if (!req.user.roles.includes('COMMERCANT')) {
        return res.status(403).json({ message: "Access denied. Not a COMMERCANT." });
      }
      let boutique = await Boutique.findById(req.params.id);
      if (!boutique) {
        return res.status(404).json({ message: "Boutique not found" });
      }
  
      let imageUrl = boutique.photo;
      if (req.file) {
        console.log(" Uploading updated image to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "boutiques", public_id: req.file.originalname.split(".")[0] },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
  
        console.log(" Image uploaded:", uploadResult.secure_url);
        imageUrl = uploadResult.secure_url;
      }
  
      boutique = await Boutique.findByIdAndUpdate(
        req.params.id,
        { nomBoutique, address, idCommercant, photo: imageUrl },
        { new: true }
      );
  
      res.status(200).json({ msg: "Boutique updated successfully!", boutique });
    } catch (error) {
      console.error(" Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  const deleteBoutique = async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);
      if (!boutique) {
        return res.status(404).json({ message: "Boutique not found" });
      }
      if (boutique.photo) {
        console.log(" Deleting image from Cloudinary...");
        const publicId = boutique.photo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`boutiques/${publicId}`);
        console.log(" Image deleted from Cloudinary");
      }
  
      await Boutique.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Boutique deleted successfully!" });
  
    } catch (error) {
      console.error(" Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
module.exports = {
    addBoutique,
    getAllBoutiques,
    getBoutiqueById,
    updateBoutique,
    deleteBoutique,
    getBoutiqueByIdCommercant,
    boutiquestatusupdate,
    getBoutiqueBystatus
 };
