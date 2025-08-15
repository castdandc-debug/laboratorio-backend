
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Paquete = sequelize.define('Paquete', {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    tableName: 'paquetes',
    timestamps: true
  });

  return Paquete;
};

