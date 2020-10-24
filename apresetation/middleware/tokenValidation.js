const jwt = require('jsonwebtoken');
const { SECRET } = require('../../utils/SECRET');

// Código ajuda do Illan;
const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  jwt.verify(token, SECRET, (err, userData) => {
    if (err) {
      return res.status(401).json({ message: 'Token expirado ou inválido' });
    }
    req.token = token;
    req.user = userData;
    next();
  });
};

module.exports = validateToken;
