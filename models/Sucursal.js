
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sucursal = sequelize.define('Sucursal', {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    facebook: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(100), // Ruta al logo: 'sucursales/logo1.png'
      allowNull: true
    }
  }, {
    tableName: 'sucursales',
    timestamps: true
  });

  return Sucursal;
};

