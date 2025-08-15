
const { DataTypes } = require('sequelize');
const { calcularEdad } = require('../utils/fechas');

module.exports = (sequelize) => {
  const Paciente = sequelize.define('Paciente', {
    nombreCompleto: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nombre_completo'
    },
    folio: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha_nacimiento'
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false  // ? Este campo no puede ser null
    },
    fechaRegistro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_registro'
    },
    diagnostico: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medicoSolicita: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'medico_solicita'
    },
    tratamiento: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sucursal_id'
    }
  }, {
    tableName: 'pacientes',
    // ? Quitamos los hooks del modelo y calculamos edad en la ruta
  });

  return Paciente;
};

