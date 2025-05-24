const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth'); // import your auth middleware
const upload = require('../middlewares/multer');

const {
  addBoutique,
  getAllBoutiques,
  getBoutiqueById,
  updateBoutique,
  deleteBoutique,
  getBoutiqueByIdCommercant,
  boutiquestatusupdate
} = require('../controllers/Boutique.controller');

// Protect all routes with auth middleware
router.post('/', auth(), upload.single('photo'), addBoutique);
router.get('/', auth(), getAllBoutiques);
router.get('/:id', auth(), getBoutiqueById);
router.get('/Commercant/:id', auth(), getBoutiqueByIdCommercant);
router.put('/:id', auth(), upload.single('photo'), updateBoutique);
router.delete('/:id', auth(), deleteBoutique);
router.put('/status/:id',auth(),boutiquestatusupdate)

module.exports = router;
