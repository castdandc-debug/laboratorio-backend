
const { Sucursal } = require('../models');
const express = require('express');
const router = express.Router();

// GET /api/sucursales - Listar todas
router.get('/', async (req, res) => {
  try {
    const sucursales = await Sucursal.findAll();
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sucursales - Crear sucursal
router.post('/', async (req, res) => {
  try {
    const sucursal = await Sucursal.create(req.body);
    res.status(201).json(sucursal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/sucursales/:id - Actualizar
router.put('/:id', async (req, res) => {
  try {
    const sucursal = await Sucursal.findByPk(req.params.id);
    if (!sucursal) return res.status(404).json({ error: 'Sucursal no encontrada' });
    await sucursal.update(req.body);
    res.json(sucursal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

