const airplaneModel = require('../models/airplaneModel');
const assignmentModel = require('../models/assignmentModel');
const AppError = require('./AppError');

const validate = (data, { partial = false } = {}) => {
  const required = ['modelo', 'matricula', 'capacidadMaxima', 'fabricante'];
  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') {
        throw new AppError(`El campo '${field}' es obligatorio`);
      }
    }
  }
  if (data.capacidadMaxima !== undefined && (typeof data.capacidadMaxima !== 'number' || data.capacidadMaxima <= 0)) {
    throw new AppError("'capacidadMaxima' debe ser un número mayor a 0");
  }
};

const listAirplanes = async () => airplaneModel.getAll();

const getAirplane = async (id) => {
  const airplane = await airplaneModel.getById(id);
  if (!airplane) throw new AppError('Avión no encontrado', 404);
  return airplane;
};

const registerAirplane = async (data) => {
  validate(data);
  if (await airplaneModel.findByPlate(data.matricula)) {
    throw new AppError('Ya existe un avión con esa matrícula', 409);
  }
  const { modelo, matricula, capacidadMaxima, fabricante } = data;
  return airplaneModel.save({ modelo, matricula, capacidadMaxima, fabricante });
};

const updateAirplane = async (id, changes) => {
  await getAirplane(id);
  validate(changes, { partial: true });
  if (changes.matricula) {
    const other = await airplaneModel.findByPlate(changes.matricula);
    if (other && other.id !== Number(id)) throw new AppError('Ya existe un avión con esa matrícula', 409);
  }
  const { modelo, matricula, capacidadMaxima, fabricante } = changes;
  const clean = Object.fromEntries(
    Object.entries({ modelo, matricula, capacidadMaxima, fabricante }).filter(([, v]) => v !== undefined)
  );
  return airplaneModel.update(id, clean);
};

const deleteAirplane = async (id) => {
  await getAirplane(id);
  const assignments = await assignmentModel.findByAirplane(id);
  if (assignments.length > 0) {
    throw new AppError('No se puede eliminar: el avión tiene asignaciones registradas', 409);
  }
  return airplaneModel.remove(id);
};

module.exports = { listAirplanes, getAirplane, registerAirplane, updateAirplane, deleteAirplane };
