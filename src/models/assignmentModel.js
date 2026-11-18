const { createRepository } = require('./jsonRepository');

const repo = createRepository('assignments.json', 'idAsignacion');

const findByPilot = async (idPiloto) => {
  const items = await repo.getAll();
  return items.filter((a) => a.idPiloto === Number(idPiloto));
};

const findByAirplane = async (idAvion) => {
  const items = await repo.getAll();
  return items.filter((a) => a.idAvion === Number(idAvion));
};

module.exports = { ...repo, findByPilot, findByAirplane };
