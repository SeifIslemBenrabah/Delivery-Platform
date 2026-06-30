const router  = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/trackingController');

router.get('/live',                   authenticate, ctrl.getLiveSnapshot);
router.get('/order/:orderId',         authenticate, ctrl.getOrderTracking);
router.get('/livreur/:livreurId',     authenticate, ctrl.getLivreurPosition);
router.get('/livreur/:livreurId/history', authenticate, ctrl.getPositionHistory);

module.exports = router;