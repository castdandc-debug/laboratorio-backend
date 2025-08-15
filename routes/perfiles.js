
const { Perfil, Prueba } = require('../models');
const express = require('express');
const router = express.Router();

// GET /perfiles - Listar todos los perfiles
router.get('/', async (req, res) => {
  try {
    const perfiles = await Perfil.findAll({
      include: { model: Prueba, attributes: ['id', 'clave', 'nombre', 'unidadMedida'] }
    });
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /perfiles - Crear un perfil
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, pruebas } = req.body;

    const perfil = await Perfil.create({ nombre, descripcion });

    if (pruebas && pruebas.length > 0) {
      await perfil.addPruebas(pruebas);
    }

    const perfilCompleto = await Perfil.findByPk(perfil.id, {
      include: { model: Prueba, attributes: ['id', 'clave', 'nombre', 'unidadMedida'] }
    });

    res.status(201).json(perfilCompleto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /perfiles/:id - Modificar un perfil
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, pruebas } = req.body;
    const perfil = await Perfil.findByPk(req.params.id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await perfil.update({ nombre, descripcion });

    if (pruebas !== undefined) {
      await perfil.setPruebas(pruebas); // Reemplaza todas las pruebas
    }

    const perfilActualizado = await Perfil.findByPk(perfil.id, {
      include: { model: Prueba, attributes: ['id', 'clave', 'nombre', 'unidadMedida'] }
    });

    res.json(perfilActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /perfiles/:id - Eliminar perfil
router.delete('/:id', async (req, res) => {
  try {
    const perfil = await Perfil.findByPk(req.params.id);
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    await perfil.destroy();
    res.json({ mensaje: 'Perfil eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

