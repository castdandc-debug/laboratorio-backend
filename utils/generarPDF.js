const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = async function generarReporte(paciente, resultados, nombreArchivo = 'reporte.pdf') {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const filePath = path.join(process.cwd(), 'reportes', nombreArchivo);

      const folder = path.dirname(filePath);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // === DATOS DE LA SUCURSAL (seguro) ===
      const sucursal = paciente.Sucursal || {};
      const nombreLab = sucursal.nombre || 'Laboratorio Clínico';
      const direccion = sucursal.direccion || '';
      const telefono = sucursal.telefono ? `Tel: ${sucursal.telefono}` : '';
      const whatsapp = sucursal.whatsapp ? `WhatsApp: ${sucursal.whatsapp}` : '';
      const correo = sucursal.correo ? `Correo: ${sucursal.correo}` : '';
      const facebook = sucursal.facebook ? `Facebook: ${sucursal.facebook}` : '';

      // Insertar logos
      const logo1Path = path.join(process.cwd(), 'logo.png');
      const logo2Path = path.join(process.cwd(), 'logo2.png');
      if (fs.existsSync(logo1Path)) doc.image(logo1Path, 50, 55, { width: 100 });
      if (fs.existsSync(logo2Path)) doc.image(logo2Path, 500, 55, { width: 70 });

      // Título y datos del laboratorio
      doc
        .fontSize(11)
        .fillColor('#000000')
        .text(nombreLab, 200, 60, { width: 200, align: 'center' })
        .fontSize(9)
        .fillColor('#003366')
        .text(direccion, 200, 80, { width: 200, align: 'center' })
        .text(telefono, 200, 95, { width: 200, align: 'center' })
        .text(whatsapp, 200, 110, { width: 200, align: 'center' })
        .text(correo, 200, 125, { width: 200, align: 'center' })
        .text(facebook, 200, 140, { width: 200, align: 'center' });

      // Leyenda en cursiva
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .fillColor('#808080')
        .text('Calidez en la toma, calidad en el resultado...', 35, 150, { width: 200, align: 'center' })
        .font('Helvetica');

      // Datos del paciente
      const y = 180;
      doc
        .fontSize(11)
        .fillColor('black')
        .text('Datos del Paciente', 50, y);

      doc.fontSize(9);
      const x1 = 50, x2 = 200, x3 = 350;
      const y1 = y + 20;
      doc.text(`Folio: ${paciente.folio}`, x1, y1);
      doc.text(`Nombre: ${paciente.nombreCompleto}`, x2, y1);
      doc.text(`Edad: ${paciente.edad} años`, x3, y1);

      const y2 = y1 + 20;
      doc.text(`Sexo: ${paciente.sexo || 'N/A'}`, x1, y2);
      doc.text(`Médico: ${paciente.medicoSolicita || 'N/A'}`, x2, y2);
      doc.text(`Fecha de impresión: ${new Date().toLocaleString('es-MX')}`, x3, y2);

      // Marca de agua
      const marcaPath = path.join(process.cwd(), 'marcaDeAgua.png');
      if (fs.existsSync(marcaPath)) {
        doc.opacity(0.1);
        doc.image(marcaPath, (doc.page.width - 300) / 2, 250, { width: 300 });
        doc.opacity(1);
      }

      // Resultados
      let currentY = y2 + 40;
      doc
        .fontSize(11)
        .text('Resultados de Pruebas', 50, currentY);

      currentY += 20;
      if (!Array.isArray(resultados)) resultados = [];
      resultados.forEach(res => {
        const prueba = res.Prueba;
        const valor = res.valor;
        const unidad = prueba.unidadMedida || '';
        const rango = prueba.valoresNormales || 'No especificado';
        const fuera = res.fueraDeRango;

        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        doc
          .fontSize(10)
          .fillColor(fuera ? 'red' : 'black')
          .text(`${prueba.nombre}: ${valor} ${unidad} (Rango: ${rango}) ${fuera ? '⚠️ Fuera de rango' : ''}`, 50, currentY);
        currentY += 20;
      });

      // Pie de página
      const footerY = doc.page.height - 120;
      doc
        .moveTo(50, footerY)
        .lineTo(550, footerY)
        .stroke()
        .moveDown(10)
        .text('ATENTAMENTE', { align: 'center' })
        .moveDown(5)
        .text('Q.F.B. DANNY ENRIQUE CASTILLO DZUL', { align: 'center' })
        .text('RESPONSABLE SANITARIO', { align: 'center' })
        .text('CED. PROF. 11626824', { align: 'center' });

      // Número de página
      doc
        .fontSize(8)
        .fillColor('gray')
        .text('Página 1 de 1', 50, doc.page.height - 40, {
             lineBreak: false,
             paragraphGap: 0,
             indent: 0,
             align: 'left',
             columns: 1
      });

      // Finalizar
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      console.error('Error en generarPDF:', error.message);
      reject(new Error('No se pudo generar el PDF'));
    }
  });
};