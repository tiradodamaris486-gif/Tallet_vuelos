const pilotModel = require('../models/pilotModel');
const assignmentModel = require('../models/assignmentModel');
const AppError = require('./AppError');

const validate = (data, { partial = false } = {}) => {
  const required = ['nombre', 'licencia', 'horasVuelo'];
  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') {
        throw new AppError(`El campo '${field}' es obligatorio`);
      }
    }
  }
  if (data.nombre !== undefined && typeof data.nombre !== 'string') {
    throw new AppError("'nombre' debe ser texto");
  }
  if (data.horasVuelo !== undefined && (typeof data.horasVuelo !== 'number' || data.horasVuelo < 0)) {
    throw new AppError("'horasVuelo' debe ser un número mayor o igual a 0");
  }
};

const listPilots = async () => pilotModel.getAll();

const getPilot = async (id) => {
  const pilot = await pilotModel.getById(id);
  if (!pilot) throw new AppError('Piloto no encontrado', 404);
  return pilot;
};

const registerPilot = async (pilotData) => {
  validate(pilotData);
  if (await pilotModel.findByLicense(pilotData.licencia)) {
    throw new AppError('Ya existe un piloto con esa licencia', 409);
  }
  const { nombre, licencia, horasVuelo, estado = 'activo' } = pilotData;
  return pilotModel.save({ nombre, licencia, horasVuelo, estado });
};

const updatePilot = async (id, changes) => {
  await getPilot(id);
  validate(changes, { partial: true });
  if (changes.licencia) {
    const other = await pilotModel.findByLicense(changes.licencia);
    if (other && other.id !== Number(id)) throw new AppError('Ya existe un piloto con esa licencia', 409);
  }
  const { nombre, licencia, horasVuelo, estado } = changes;
  const clean = Object.fromEntries(
    Object.entries({ nombre, licencia, horasVuelo, estado }).filter(([, v]) => v !== undefined)
  );
  return pilotModel.update(id, clean);
};

const deletePilot = async (id) => {
  await getPilot(id);
  const assignments = await assignmentModel.findByPilot(id);
  if (assignments.length > 0) {
    throw new AppError('No se puede eliminar: el piloto tiene asignaciones registradas', 409);
  }
  return pilotModel.remove(id);
};

module.exports = { listPilots, getPilot, registerPilot, updatePilot, deletePilot };
