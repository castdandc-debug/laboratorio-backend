
const generarFolio = async (Paciente, sequelize) => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const ano = String(hoy.getFullYear()).slice(-2);

  // Concatenamos la fecha: YYMMDD
  const fechaStr = ano + mes + dia; // ej: 250814

  // Contar cuántos pacientes ya se registraron hoy
  const [result] = await sequelize.query(
    'SELECT COUNT(*) as total FROM pacientes WHERE folio LIKE ?',
    { replacements: [fechaStr + '%'] }
  );

  const totalHoy = parseInt(result[0].total);
  const consecutivo = String(totalHoy + 1).padStart(3, '0'); // 001, 002...

  return fechaStr + consecutivo; // ej: 250814001
};

module.exports = { generarFolio };

