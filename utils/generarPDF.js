const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = async function generarReporte(paciente, resultados, nombreArchivo = 'reporte.pdf') {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filePath = path.join(process.cwd(), 'reportes', nombreArchivo);

  // Asegurar que la carpeta exista
  const folder = path.dirname(filePath);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  doc.pipe(fs.createWriteStream(filePath));

  // Título
  doc
    .fontSize(20)
    .fillColor('#003366')
    .text('Laboratorio Clínico', { align: 'center' })
    .fontSize(14)
    .text('Reporte de Resultados', { align: 'center' })
    .moveDown();

  // Datos del paciente
  doc
    .fontSize(12)
    .fillColor('black')
    .text('Datos del Paciente', { underline: true })
    .moveDown(0.5);
  doc
    .fontSize(10)
    .text(`Folio: ${paciente.folio}`)
    .text(`Nombre: ${paciente.nombreCompleto}`)
    .text(`Edad: ${paciente.edad} años`)
    .text(`Fecha de registro: ${new Date(paciente.fechaRegistro).toLocaleDateString()}`)
    .moveDown();

  // Resultados
  doc
    .fontSize(12)
    .fillColor('black')
    .text('Resultados de Pruebas', { underline: true })
    .moveDown(0.5);

  resultados.forEach(res => {
    const prueba = res.Prueba;
    const valor = res.valor;
    const unidad = prueba.unidadMedida || '';
    const rango = prueba.valoresNormales || 'No especificado';
    const fuera = res.fueraDeRango;

    doc
      .fontSize(10)
      .fillColor(fuera ? 'red' : 'black')
      .text(`${prueba.nombre}: ${valor} ${unidad} (Rango: ${rango}) ${fuera ? '⚠️ Fuera de rango' : ''}`);
  });

  // Pie de página
  doc
    .moveDown()
    .fontSize(8)
    .fillColor('gray')
    .text('Este reporte fue generado automáticamente. Consulte a su médico para interpretación clínica.', { align: 'center' });

  doc.end();

  return filePath;
};