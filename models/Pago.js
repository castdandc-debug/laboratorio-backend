
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    montoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    montoPagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.ENUM('pagado', 'pendiente'),
      allowNull: false,
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'pagos',
    timestamps: true
  });

  return Pago;
};

