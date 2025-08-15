
const { Paquete, Prueba, Perfil } = require('../models');
const express = require('express');
const router = express.Router();

// POST /paquetes - Crear paquete
router.post('/', async (req, res) => {
  console.log('?? Cuerpo recibido:', req.body); // ?? Depuración

  try {
    const { nombre, descripcion, pruebas, perfiles } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }

    const paquete = await Paquete.create({ nombre, descripcion });

    if (pruebas && pruebas.length > 0) await paquete.addPruebas(pruebas);
    if (perfiles && perfiles.length > 0) await paquete.addPerfiles(perfiles);

    const paqueteCompleto = await Paquete.findByPk(paquete.id, {
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre'] },
        { model: Perfil, attributes: ['id', 'nombre'] }
      ]
    });

    res.status(201).json(paqueteCompleto);
  } catch (error) {
    console.error('? Error al crear paquete:', error.message);
    res.status(400).json({ error: 'Validation error', detalle: error.message });
  }
});

// GET /paquetes - Listar todos
router.get('/', async (req, res) => {
  try {
    const paquetes = await Paquete.findAll({
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre'] },
        { model: Perfil, attributes: ['id', 'nombre'] }
      ]
    });
    res.json(paquetes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /paquetes/:id - Modificar
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, pruebas, perfiles } = req.body;
    const paquete = await Paquete.findByPk(req.params.id);

    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    await paquete.update({ nombre, descripcion });

    if (pruebas !== undefined) await paquete.setPruebas(pruebas);
    if (perfiles !== undefined) await paquete.setPerfiles(perfiles);

    const paqueteActualizado = await Paquete.findByPk(paquete.id, {
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre'] },
        { model: Perfil, attributes: ['id', 'nombre'] }
      ]
    });

    res.json(paqueteActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /paquetes/:id
router.delete('/:id', async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await paquete.destroy();
    res.json({ mensaje: 'Paquete eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

