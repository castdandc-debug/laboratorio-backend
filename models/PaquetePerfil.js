
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaquetePerfil = sequelize.define('PaquetePerfil', {
    paqueteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'paquetes',
        key: 'id'
      },
      primaryKey: true
    },
    perfilId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'perfiles',
        key: 'id'
      },
      primaryKey: true
    }
  }, {
    tableName: 'paquete_perfil',
    timestamps: false
  });

  return PaquetePerfil;
};

