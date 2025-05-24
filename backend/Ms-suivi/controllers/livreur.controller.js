const Livreur = require('../models/Livreur');

// ✅ Add a new Livreur
const addLivreur = async (req, res) => {
    try {
        const { location, Availability, commandes } = req.body;

        const livreur = new Livreur({
            location,
            Availability,
            commandes
        });

        await livreur.save();
        res.status(201).json({ message: "Livreur added successfully", livreur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all Livreurs
const getAllLivreurs = async (req, res) => {
    try {
        const livreurs = await Livreur.find();
        res.status(200).json(livreurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get a single Livreur by ID
const getLivreurById = async (req, res) => {
    try {
        const livreur = await Livreur.findById(req.params.id);
        if (!livreur) {
            return res.status(404).json({ message: "Livreur not found" });
        }
        res.status(200).json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a Livreur
const updateLivreur = async (req, res) => {
    try {
        const { location, Availability, commandes } = req.body;
        const updatedLivreur = await Livreur.findByIdAndUpdate(
            req.params.id,
            { location, Availability, commandes },
            { new: true, runValidators: true }
        );

        if (!updatedLivreur) {
            return res.status(404).json({ message: "Livreur not found" });
        }

        res.status(200).json({ message: "Livreur updated successfully", updatedLivreur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a Livreur
const deleteLivreur = async (req, res) => {
    try {
        const deletedLivreur = await Livreur.findByIdAndDelete(req.params.id);
        if (!deletedLivreur) {
            return res.status(404).json({ message: "Livreur not found" });
        }
        res.status(200).json({ message: "Livreur deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const notifLivreur = async (req,res)=>{
    try{
        const { idLivreur , idCommande } = req.body;
        
    }
    catch(error){

    }
}

module.exports = {
    addLivreur,
    getAllLivreurs,
    getLivreurById,
    updateLivreur,
    deleteLivreur
};
