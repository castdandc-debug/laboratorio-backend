
const express = require('express');
const router = express.Router();
const { sequelize, Paciente, Prueba, Perfil, Paquete, Pago } = require('../models');

// GET /api/nota-venta/:folio
router.get('/nota-venta/:folio', async (req, res) => {
  try {
    // Esperar a que los modelos estén listos
    if (!Paciente || !Pago) {
      return res.status(500).json({ error: 'Modelos no cargados' });
    }

    const paciente = await Paciente.findOne({
      where: { folio: req.params.folio },
      include: [
        { model: Prueba, attributes: ['nombre', 'precio'] },
        { model: Perfil, attributes: ['nombre', 'precio'] },
        { model: Paquete, attributes: ['nombre', 'precio'] },
        { model: Pago }
      ]
    });

    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    // Calcular total
    const pruebasTotal = (paciente.Pruebas || []).reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const perfilesTotal = (paciente.Perfils || []).reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const paquetesTotal = (paciente.Paquetes || []).reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const montoTotal = pruebasTotal + perfilesTotal + paquetesTotal;

    const descuento = paciente.Pago?.descuento || 0;
    const montoPagado = paciente.Pago?.montoPagado || 0;
    const saldo = montoTotal - descuento - montoPagado;

    res.json({
      paciente: {
        folio: paciente.folio,
        nombreCompleto: paciente.nombreCompleto,
        fechaRegistro: paciente.fechaRegistro
      },
      estudios: {
        pruebas: paciente.Pruebas || [],
        perfiles: paciente.Perfils || [],
        paquetes: paciente.Paquetes || []
      },
      pago: {
        montoTotal: parseFloat(montoTotal.toFixed(2)),
        descuento: parseFloat(descuento.toFixed(2)),
        montoPagado: parseFloat(montoPagado.toFixed(2)),
        saldo: parseFloat(saldo.toFixed(2)),
        estado: saldo <= 0 ? 'pagado' : 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error en nota de venta:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      detalle: error.message 
    });
  }
});

module.exports = router;

