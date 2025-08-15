
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resultado = sequelize.define('Resultado', {
    valor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fueraDeRango: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'resultados',
    timestamps: true
  });

  return Resultado;
};

