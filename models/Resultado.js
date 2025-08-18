const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resultado = sequelize.define('Resultado', {
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'paciente_id'
    },
    pruebaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'prueba_id'
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fueraDeRango: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'usuario_id'
    }
  }, {
    tableName: 'resultados',
    timestamps: true
  });

  return Resultado;
};
