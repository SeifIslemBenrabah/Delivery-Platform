const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/commandeController');

// Admin only
router.get('/', authenticate, requireRole('ADMIN'), ctrl.getAll);

// All authenticated
router.get('/mine',         authenticate, ctrl.getMine);
router.get('/available',    authenticate, requireRole('LIVREUR'), ctrl.getAvailable);
router.get('/:id',          authenticate, ctrl.getById);
router.post('/',            authenticate, requireRole('CLIENT'), ctrl.create);
router.patch('/:id/status', authenticate, ctrl.updateStatus);
router.patch('/:id/assign', authenticate, requireRole('LIVREUR', 'ADMIN'), ctrl.assignToLivreur);

module.exports = router;