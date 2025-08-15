
const { Paciente, Prueba, Resultado } = require('../models');
const express = require('express');
const router = express.Router();

// POST /api/resultados - Registrar resultado
router.post('/', async (req, res) => {
  try {
    const { pacienteId, pruebaId, valor } = req.body;

    const paciente = await Paciente.findByPk(pacienteId);
    const prueba = await Prueba.findByPk(pruebaId);

    if (!paciente || !prueba) {
      return res.status(404).json({ error: 'Paciente o prueba no encontrados' });
    }

    // Validar si está fuera de rango (solo cuantitativas)
    let fueraDeRango = false;
    if (prueba.tipoPrueba === 'cuantitativa' && prueba.valoresNormales) {
      const [min, max] = prueba.valoresNormales.split('-').map(Number);
      const valorNum = parseFloat(valor);
      fueraDeRango = isNaN(valorNum) ? false : (valorNum < min || valorNum > max);
    }

    const resultado = await Resultado.create({ pacienteId, pruebaId, valor, fueraDeRango });

    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/resultados/paciente/:id - Listar resultados de un paciente
router.get('/paciente/:id', async (req, res) => {
  try {
    const resultados = await Resultado.findAll({
      where: { pacienteId: req.params.id },
      include: [
        { model: Prueba, attributes: ['nombre', 'unidadMedida', 'valoresNormales', 'tipoPrueba'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

