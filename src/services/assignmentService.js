const assignmentModel = require('../models/assignmentModel');
const pilotModel = require('../models/pilotModel');
const airplaneModel = require('../models/airplaneModel');
const AppError = require('./AppError');

// Validación relacional: el piloto y el avión deben existir.
const checkRelations = async ({ idPiloto, idAvion }) => {
  if (idPiloto !== undefined && !(await pilotModel.getById(idPiloto))) {
    throw new AppError(`El piloto con id ${idPiloto} no existe`, 404);
  }
  if (idAvion !== undefined && !(await airplaneModel.getById(idAvion))) {
    throw new AppError(`El avión con id ${idAvion} no existe`, 404);
  }
};

const validate = (data, { partial = false } = {}) => {
  const required = ['idPiloto', 'idAvion', 'fechaVuelo', 'rutaAsignada'];
  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') {
        throw new AppError(`El campo '${field}' es obligatorio`);
      }
    }
  }
  if (data.fechaVuelo !== undefined && Number.isNaN(Date.parse(data.fechaVuelo))) {
    throw new AppError("'fechaVuelo' no es una fecha válida (use formato AAAA-MM-DD)");
  }
};

const listAssignments = async () => assignmentModel.getAll();

const getAssignment = async (id) => {
  const assignment = await assignmentModel.getById(id);
  if (!assignment) throw new AppError('Asignación no encontrada', 404);
  return assignment;
};

const createAssignment = async (data) => {
  validate(data);
  await checkRelations(data);
  const { idPiloto, idAvion, fechaVuelo, rutaAsignada } = data;
  return assignmentModel.save({ idPiloto, idAvion, fechaVuelo, rutaAsignada });
};

const updateAssignment = async (id, changes) => {
  await getAssignment(id);
  validate(changes, { partial: true });
  await checkRelations(changes);
  const { idPiloto, idAvion, fechaVuelo, rutaAsignada } = changes;
  const clean = Object.fromEntries(
    Object.entries({ idPiloto, idAvion, fechaVuelo, rutaAsignada }).filter(([, v]) => v !== undefined)
  );
  return assignmentModel.update(id, clean);
};

const deleteAssignment = async (id) => {
  await getAssignment(id);
  return assignmentModel.remove(id);
};

module.exports = { listAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment };
