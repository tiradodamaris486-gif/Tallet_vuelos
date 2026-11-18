const { createRepository } = require('./jsonRepository');

const repo = createRepository('pilots.json', 'id');

const findByLicense = async (licencia) => {
  const pilots = await repo.getAll();
  return pilots.find((p) => p.licencia === licencia) || null;
};

module.exports = { ...repo, findByLicense };
