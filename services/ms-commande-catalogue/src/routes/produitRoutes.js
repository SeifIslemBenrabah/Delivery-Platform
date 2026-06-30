const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { uploadProduit } = require('../config/cloudinary');
const ctrl = require('../controllers/produitController');

router.get('/',     authenticate, ctrl.getAll);
router.get('/:id',  authenticate, ctrl.getById);
router.post('/',    authenticate, requireRole('COMMERCANT'), uploadProduit.single('photo'), ctrl.create);
router.put('/:id',  authenticate, requireRole('COMMERCANT', 'ADMIN'), uploadProduit.single('photo'), ctrl.update);
router.delete('/:id', authenticate, requireRole('COMMERCANT', 'ADMIN'), ctrl.remove);

module.exports = router;