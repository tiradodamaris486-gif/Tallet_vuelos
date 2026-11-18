const pilotService = require('../services/pilotService');

const respondError = (res, error) =>
  res.status(error.status || 500).json({ error: error.message });

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.listPilots());
  } catch (error) {
    return respondError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.getPilot(req.params.id));
  } catch (error) {
    return respondError(res, error);
  }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await pilotService.registerPilot(req.body));
  } catch (error) {
    return respondError(res, error);
  }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.updatePilot(req.params.id, req.body));
  } catch (error) {
    return respondError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    const removed = await pilotService.deletePilot(req.params.id);
    return res.status(200).json({ mensaje: 'Eliminado correctamente', eliminado: removed });
  } catch (error) {
    return respondError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
