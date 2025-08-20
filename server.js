const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize, Prueba, Perfil, Paquete, Paciente, Pago, Resultado } = require('./models');
const pruebasRoutes = require('./routes/pruebas');
const perfilesRoutes = require('./routes/perfiles');
const paquetesRoutes = require('./routes/paquetes');
const pacientesRoutes = require('./routes/pacientes');
const preciosRoutes = require('./routes/precios');
const resultadosRoutes = require('./routes/resultados');
const notaVentaRoutes = require('./routes/notaVenta');
const reporteRoutes = require('./routes/reporte');
const sucursalesRoutes = require('./routes/sucursales');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

// ✅ Debes declarar 'app' ANTES de usarlo
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['https://castdandc-debug.github.io', 'http://localhost:5000'], // ✅ Corregido: sin espacios extra
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Inyectar sequelize en contexto
app.use((req, res, next) => {
  req.context = { sequelize };
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor del Laboratorio Clinico funcionando correctamente' });
});

// Ruta para probar conexión a BD
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ mensaje: 'Conexion a BD exitosa' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al conectar a BD',
      detalle: error.message
    });
  }
});

// Ruta de diagnóstico
app.get('/debug', (req, res) => {
  res.json({
    Prueba: !!Prueba,
    Perfil: !!Perfil,
    Paquete: !!Paquete,
    Paciente: !!Paciente,
    Pago: !!Pago,
    Resultado: !!Resultado,
    sequelize: !!sequelize
  });
});

// Rutas
app.use('/api/pruebas', pruebasRoutes);
app.use('/api/perfiles', perfilesRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/precios', preciosRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api', notaVentaRoutes);
app.use('/api', reporteRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Iniciar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, '0.0.0.0', () => {
      console.log('Servidor corriendo en http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
  }
}

startServer();

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? error.message : null
  });
});
