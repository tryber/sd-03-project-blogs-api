const jwt = require('jsonwebtoken');
const { User } = require('../models');
const consts = require('../consts');

const { SECRET } = consts;

const authJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    const email = decoded.data;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Token expirado ou inválido' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};

module.exports = {
  authJWT,
};
