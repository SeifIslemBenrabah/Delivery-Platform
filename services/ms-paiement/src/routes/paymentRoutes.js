const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

// Chargily webhook — raw body needed for HMAC, no JWT
router.post('/webhook', ctrl.webhook);

// All other routes require auth
router.use(authenticate);

router.post(  '/initiate',          requireRole('CLIENT'),                  ctrl.initiatePayment);
router.get(   '/mine',                                                      ctrl.listMyPayments);
router.get(   '/all',               requireRole('ADMIN'),                   ctrl.listAll);
router.get(   '/earnings',          requireRole('LIVREUR'),                 ctrl.getMyEarnings);
router.get(   '/revenu',            requireRole('COMMERCANT'),              ctrl.getMyRevenu);
router.get(   '/:id',                                                       ctrl.getPayment);
router.get(   '/:id/invoice',                                               ctrl.downloadInvoice);
router.patch( '/:id/refund',        requireRole('ADMIN'),                   ctrl.refundPayment);

module.exports = router;