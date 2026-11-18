const { createRepository } = require('./jsonRepository');

const repo = createRepository('airplanes.json', 'id');

const findByPlate = async (matricula) => {
  const airplanes = await repo.getAll();
  return airplanes.find((a) => a.matricula === matricula) || null;
};

module.exports = { ...repo, findByPlate };
