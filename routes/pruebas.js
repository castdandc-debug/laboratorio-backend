
const { Prueba } = require('../models');
const express = require('express');
const router = express.Router();

// GET /pruebas - Listar todas
router.get('/', async (req, res) => {
  try {
    const pruebas = await Prueba.findAll();
    res.json(pruebas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /pruebas - Crear
router.post('/', async (req, res) => {
  try {
    const prueba = await Prueba.create(req.body);
    res.status(201).json(prueba);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /pruebas/:id - Modificar
router.put('/:id', async (req, res) => {
  try {
    const prueba = await Prueba.findByPk(req.params.id);
    if (!prueba) return res.status(404).json({ error: 'Prueba no encontrada' });
    await prueba.update(req.body);
    res.json(prueba);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /pruebas/:id
router.delete('/:id', async (req, res) => {
  try {
    const prueba = await Prueba.findByPk(req.params.id);
    if (!prueba) return res.status(404).json({ error: 'Prueba no encontrada' });
    await prueba.destroy();
    res.json({ mensaje: 'Prueba eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

