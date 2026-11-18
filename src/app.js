const express = require('express');
const pilotRoutes = require('./routes/pilotRoutes');
const airplaneRoutes = require('./routes/airplaneRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', pilotRoutes);
app.use('/api', airplaneRoutes);
app.use('/api', assignmentRoutes);

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Cuerpo JSON inválido y errores no controlados
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
