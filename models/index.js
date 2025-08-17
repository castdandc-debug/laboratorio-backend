
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error('? DB_URL no está definida en .env');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// --- Cargar modelos ---
const Prueba = require('./Prueba')(sequelize);
const Perfil = require('./Perfil')(sequelize);
const Paquete = require('./Paquete')(sequelize);
const Paciente = require('./Paciente')(sequelize);
const Pago = require('./Pago')(sequelize);
const Resultado = require('./Resultado')(sequelize);
const PerfilPrueba = require('./PerfilPrueba')(sequelize);
const PaquetePrueba = require('./PaquetePrueba')(sequelize);
const PaquetePerfil = require('./PaquetePerfil')(sequelize);
const Sucursal = require('./Sucursal')(sequelize);
const Usuario = require('./Usuario')(sequelize);

// --- Relaciones ---

// Perfil ? Prueba
Perfil.belongsToMany(Prueba, { through: PerfilPrueba, foreignKey: 'perfilId' });
Prueba.belongsToMany(Perfil, { through: PerfilPrueba, foreignKey: 'pruebaId' });

// Paquete ? Prueba
Paquete.belongsToMany(Prueba, { through: PaquetePrueba, foreignKey: 'paqueteId' });
Prueba.belongsToMany(Paquete, { through: PaquetePrueba, foreignKey: 'pruebaId' });

// Paquete ? Perfil
Paquete.belongsToMany(Perfil, { through: PaquetePerfil, foreignKey: 'paqueteId' });
Perfil.belongsToMany(Paquete, { through: PaquetePerfil, foreignKey: 'perfilId' });

// Paciente ? Prueba
Paciente.belongsToMany(Prueba, { through: 'paciente_prueba', foreignKey: 'pacienteId' });
Prueba.belongsToMany(Paciente, { through: 'paciente_prueba', foreignKey: 'pruebaId' });

// Paciente ? Perfil
Paciente.belongsToMany(Perfil, { through: 'paciente_perfil', foreignKey: 'pacienteId' });
Perfil.belongsToMany(Paciente, { through: 'paciente_perfil', foreignKey: 'perfilId' });

// Paciente ? Paquete
Paciente.belongsToMany(Paquete, { through: 'paciente_paquete', foreignKey: 'pacienteId' });
Paquete.belongsToMany(Paciente, { through: 'paciente_paquete', foreignKey: 'paqueteId' });

// Paciente ? Pago (1 a 1)
Paciente.hasOne(Pago, { foreignKey: 'pacienteId' });
Pago.belongsTo(Paciente, { foreignKey: 'pacienteId' });

// Paciente ? Resultado (1 a muchos)
Paciente.hasMany(Resultado, { foreignKey: 'pacienteId' });
Resultado.belongsTo(Paciente, { foreignKey: 'pacienteId' });

// Prueba ? Resultado (1 a muchos)
Prueba.hasMany(Resultado, { foreignKey: 'pruebaId' });
Resultado.belongsTo(Prueba, { foreignKey: 'pruebaId' });

// Paciente ? Sucursal
Paciente.belongsTo(Sucursal, { foreignKey: 'sucursalId' });
Sucursal.hasMany(Paciente, { foreignKey: 'sucursalId' });

// Relación: Resultado → Usuario (quién registró el resultado)
Resultado.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Resultado, { foreignKey: 'usuarioId' });

// Exportar
module.exports = { 
  sequelize, 
  Prueba, 
  Perfil, 
  Paquete, 
  Paciente, 
  Pago, 
  Resultado, 
  Sucursal,
  Usuario,
  PerfilPrueba, 
  PaquetePrueba, 
  PaquetePerfil 
};

console.log('? Modelos y relaciones cargados');


