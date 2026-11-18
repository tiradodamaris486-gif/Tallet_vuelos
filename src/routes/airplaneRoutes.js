const { Router } = require('express');
const airplaneController = require('../controllers/airplaneController');

const router = Router();

router.get('/aviones', airplaneController.getAll);
router.get('/aviones/:id', airplaneController.getById);
router.post('/aviones', airplaneController.create);
router.put('/aviones/:id', airplaneController.update);
router.delete('/aviones/:id', airplaneController.remove);

module.exports = router;
