
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PerfilPrueba = sequelize.define('PerfilPrueba', {
    perfilId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'perfiles',
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
    tableName: 'perfil_prueba',
    timestamps: false
  });

  return PerfilPrueba;
};

