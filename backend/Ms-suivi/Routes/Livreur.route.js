const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreur.controller');


router.post('/', livreurController.addLivreur);
router.get('/', livreurController.getAllLivreurs);
router.get('/:id', livreurController.getLivreurById);
router.put('/:id', livreurController.updateLivreur);
router.delete('/:id', livreurController.deleteLivreur);

module.exports = router;
