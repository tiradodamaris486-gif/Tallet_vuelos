// Única pieza del proyecto que usa el sistema de archivos (fs).
const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

const readJson = async (fileName) => {
  try {
    const raw = await fs.readFile(path.join(dataDir, fileName), 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeJson = async (fileName, data) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(data, null, 2));
};

// Fábrica de funciones CRUD sobre un archivo JSON.
const createRepository = (fileName, idField) => ({
  getAll: async () => readJson(fileName),

  getById: async (id) => {
    const items = await readJson(fileName);
    return items.find((item) => item[idField] === Number(id)) || null;
  },

  save: async (data) => {
    const items = await readJson(fileName);
    const nextId = items.length ? Math.max(...items.map((i) => i[idField])) + 1 : 1;
    const newItem = { [idField]: nextId, ...data };
    items.push(newItem);
    await writeJson(fileName, items);
    return newItem;
  },

  update: async (id, changes) => {
    const items = await readJson(fileName);
    const index = items.findIndex((item) => item[idField] === Number(id));
    if (index === -1) return null;
    items[index] = { ...items[index], ...changes, [idField]: items[index][idField] };
    await writeJson(fileName, items);
    return items[index];
  },

  remove: async (id) => {
    const items = await readJson(fileName);
    const index = items.findIndex((item) => item[idField] === Number(id));
    if (index === -1) return null;
    const [removed] = items.splice(index, 1);
    await writeJson(fileName, items);
    return removed;
  },
});

module.exports = { createRepository };
