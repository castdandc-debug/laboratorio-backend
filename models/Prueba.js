
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prueba = sequelize.define('Prueba', {
    clave: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipoMuestra: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tipo_muestra'
    },
    unidadMedida: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'unidad_medida'
    },
    valoresNormales: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'valores_normales'
    },
    tipoPrueba: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'tipo_prueba',
      validate: {
        isIn: [['cuantitativa', 'cualitativa']]
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    tableName: 'pruebas',
    timestamps: true
  });

  return Prueba;
};

