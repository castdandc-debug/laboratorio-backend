
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaquetePrueba = sequelize.define('PaquetePrueba', {
    paqueteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'paquetes',
        key: 'id'
      },
      primaryKey: true
    },
    pruebaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'pruebas',
        key: 'id'
      },
      primaryKey: true
    }
  }, {
    tableName: 'paquete_prueba',
    timestamps: false
  });

  return PaquetePrueba;
};

