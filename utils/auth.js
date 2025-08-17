
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET || 'clave-secreta-del-laboratorio',
    { expiresIn: '24h' }
  );
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave-secreta-del-laboratorio');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: permisos insuficientes' });
    }
    next();
  };
};

module.exports = { generarToken, verificarToken, verificarRol };

