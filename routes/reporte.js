const { Paciente } = require('../models');
const generarReporte = require('../utils/generarPDF');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/reporte/:folio - Generar PDF
router.get('/reporte/:folio', async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { folio: req.params.folio },
      include: [
        { 
          model: require('../models').Resultado, 
          include: [ require('../models').Prueba ] 
        },
        { model: require('../models').Sucursal }
      ]
    });

    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const filePath = await generarReporte(paciente, paciente.Resultados, `reporte_${paciente.folio}.pdf`);

    // Enviar el PDF como descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_${paciente.folio}.pdf`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error al generar reporte:', error.message);
    res.status(500).json({ error: 'Error al generar el informe' });
  }
});

module.exports = router;
