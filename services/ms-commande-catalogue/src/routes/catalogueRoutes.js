const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/catalogueController');

router.get('/boutique/:idBoutique', authenticate, ctrl.getByBoutique);
router.post('/',    authenticate, requireRole('COMMERCANT'), ctrl.create);
router.put('/:id',  authenticate, requireRole('COMMERCANT'), ctrl.update);
router.delete('/:id', authenticate, requireRole('COMMERCANT', 'ADMIN'), ctrl.remove);

module.exports = router;