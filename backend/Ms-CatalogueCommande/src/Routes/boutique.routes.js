const express = require('express');
const router = express.Router();
const { addBoutique ,getAllBoutiques,getBoutiqueById,updateBoutique,deleteBoutique,getBoutiqueByIdCommercant } = require('../controllers/Boutique.controller');
const upload = require('../middlewares/multer');

router.post('/', upload.single('photo'), addBoutique);
router.get("/", getAllBoutiques);
router.get("/:id", getBoutiqueById);
router.get("/Commercant/:id", getBoutiqueByIdCommercant);
router.put("/:id", upload.single("photo"), updateBoutique);
router.delete("/:id", deleteBoutique);

module.exports = router;
