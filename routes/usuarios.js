
const { Usuario } = require('../models');
const { verificarToken, verificarRol } = require('../utils/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// POST /api/usuarios - Crear usuario (solo administrador)
router.post('/', verificarToken, verificarRol('administrador'), async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si ya existe el usuario
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Ya existe un usuario con ese correo' });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol: rol || 'recepcion'
    });

    res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/usuarios - Listar todos (solo administrador)
router.get('/', verificarToken, verificarRol('administrador'), async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt'],
      order: [['rol', 'ASC'], ['nombre', 'ASC']]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

