
const { Paciente, Prueba, Perfil, Paquete } = require('../models');
const { generarFolio } = require('../utils/folio');
const { calcularEdad } = require('../utils/fechas');
const express = require('express');
const router = express.Router();

// POST /pacientes - Crear un paciente
router.post('/', async (req, res) => {
  try {
    const {
      nombreCompleto,
      fechaNacimiento,
      diagnostico,
      medicoSolicita,
      tratamiento,
      comentarios,
      sucursalId,
      estudios
    } = req.body;

    // ? Calcular edad
    if (!fechaNacimiento) {
      return res.status(400).json({ error: 'La fecha de nacimiento es obligatoria' });
    }

    const edad = calcularEdad(fechaNacimiento);

    // ? Verificar si el folio ya existe
    const folio = await generarFolio(Paciente, req.context?.sequelize || require('../models').sequelize);
    const existeFolio = await Paciente.findOne({ where: { folio } });
    
    if (existeFolio) {
      return res.status(400).json({ error: 'El folio ya existe' });
    }

    // ? Crear paciente
    const paciente = await Paciente.create({
      nombreCompleto,
      folio,
      fechaNacimiento,
      edad,
      diagnostico,
      medicoSolicita,
      tratamiento,
      comentarios,
      sucursalId
    });

    // ? Asociar estudios
    if (estudios) {
      const { pruebas, perfiles, paquetes } = estudios;

      if (pruebas?.length) await paciente.addPruebas(pruebas);
      if (perfiles?.length) await paciente.addPerfils(perfiles);
      if (paquetes?.length) await paciente.addPaquetes(paquetes);
    }

    // ? Obtener paciente completo
    const pacienteCompleto = await Paciente.findByPk(paciente.id, {
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre'] },
        { model: Perfil, attributes: ['id', 'nombre'] },
        { model: Paquete, attributes: ['id', 'nombre'] },
        { model: require('../models').Sucursal }
      ]
    });

    res.status(201).json(pacienteCompleto);
  } catch (error) {
    console.error('Error al crear paciente:', error.message);
    res.status(400).json({ 
      error: 'No se pudo crear el paciente', 
      detalle: error.message 
    });
  }
});

// GET /pacientes - Listar todos
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre'] },
        { model: Perfil, attributes: ['id', 'nombre'] },
        { model: Paquete, attributes: ['id', 'nombre'] },
        { model: require('../models').Sucursal }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pacientes/:folio - Buscar por folio
router.get('/folio/:folio', async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { folio: req.params.folio },
      include: [
        { model: Prueba, attributes: ['id', 'clave', 'nombre', 'unidadMedida', 'valoresNormales', 'tipoPrueba'] },
        { model: Perfil, attributes: ['id', 'nombre'] },
        { model: Paquete, attributes: ['id', 'nombre'] },
        { model: require('../models').Sucursal }
      ]
    });

    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

