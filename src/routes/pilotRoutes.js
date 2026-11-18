const { Router } = require('express');
const pilotController = require('../controllers/pilotController');
const { validateBody, validateId, pilotSchema } = require('../middlewares/validators');

const router = Router();

router.get('/pilotos', pilotController.getAll);
router.get('/pilotos/:id', validateId, pilotController.getById);
router.post('/pilotos', validateBody(pilotSchema), pilotController.create);
router.put('/pilotos/:id', validateId, validateBody(pilotSchema, { partial: true }), pilotController.update);
router.delete('/pilotos/:id', validateId, pilotController.remove);

module.exports = router;