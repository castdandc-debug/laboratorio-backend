
const { Prueba, Perfil, Paquete } = require('../models');
const express = require('express');
const router = express.Router();

// PUT /api/precios/prueba/:id
router.put('/prueba/:id', async (req, res) => {
  try {
    const prueba = await Prueba.findByPk(req.params.id);
    if (!prueba) return res.status(404).json({ error: 'Prueba no encontrada' });
    await prueba.update({ precio: req.body.precio });
    res.json(prueba);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/precios/perfil/:id
router.put('/perfil/:id', async (req, res) => {
  try {
    const perfil = await Perfil.findByPk(req.params.id);
    if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });
    await perfil.update({ precio: req.body.precio });
    res.json(perfil);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/precios/paquete/:id
router.put('/paquete/:id', async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await paquete.update({ precio: req.body.precio });
    res.json(paquete);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

