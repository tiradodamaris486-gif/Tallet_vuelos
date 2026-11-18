const { Router } = require('express');
const assignmentController = require('../controllers/assignmentController');

const router = Router();

router.get('/asignaciones', assignmentController.getAll);
router.get('/asignaciones/:id', assignmentController.getById);
router.post('/asignaciones', assignmentController.create);
router.put('/asignaciones/:id', assignmentController.update);
router.delete('/asignaciones/:id', assignmentController.remove);

module.exports = router;
