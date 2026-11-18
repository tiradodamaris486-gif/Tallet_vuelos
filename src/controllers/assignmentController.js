const assignmentService = require('../services/assignmentService');

const respondError = (res, error) =>
  res.status(error.status || 500).json({ error: error.message });

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.listAssignments());
  } catch (error) {
    return respondError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.getAssignment(req.params.id));
  } catch (error) {
    return respondError(res, error);
  }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await assignmentService.createAssignment(req.body));
  } catch (error) {
    return respondError(res, error);
  }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.updateAssignment(req.params.id, req.body));
  } catch (error) {
    return respondError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    const removed = await assignmentService.deleteAssignment(req.params.id);
    return res.status(200).json({ mensaje: 'Eliminado correctamente', eliminado: removed });
  } catch (error) {
    return respondError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
