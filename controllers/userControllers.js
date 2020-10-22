const rescue = require('express-rescue');
const jwt = require('jsonwebtoken');
const CustomError = require('../services/errorScheme');
const { userValidation, loginValidation } = require('../services/joiValidation');
const { Users } = require('../models');

const jwtConfig = {
  expiresIn: '3h',
  algorithm: 'HS256',
};

const token = (user) => jwt.sign({ data: user }, 'chavesecreta', jwtConfig);

const addUser = rescue(async (req, res) => userValidation.validateAsync(req.body)
  .then(async () => {
    const { body: { displayName, email, password, image } } = req;
    return Users.create({ displayName, email, password, image })
      .then((user) => {
        const newToken = token(user.dataValues);
        return res.status(201).json({ token: newToken });
      })
      .catch((err) => {
        if (err.parent && err.parent.errno === 1062) {
          throw new CustomError({ message: 'Usuário já existe', code: 409 });
        }
        throw new CustomError({ message: err.message, code: 500 });
      });
  })
  .catch(({ message, code }) => {
    throw new CustomError({ message, code: code || 400 });
  }));

const findAllUsers = rescue(async (req, res) =>
  Users.findAll().then(
    (users) => {
      if (!users) throw new CustomError({ message: 'Usuário não existe', code: 404 });
      return res.status(200).json(users);
    },
  )
    .catch((err) => {
      throw new CustomError({ message: err.message, code: 500 });
    }));

const findUserById = rescue(async (req, res) =>
  Users.findOne({ where: { id: req.params.id } }).then(
    (user) => {
      if (!user) throw new CustomError({ message: 'Usuário não existe', code: 404 });
      res.status(200).json(user);
    },
  )
    .catch((err) => {
      throw new CustomError({ message: err.message, code: 404 });
    }));

const deleteUser = rescue(async (req, res) => {
  const { user: { id } } = req;
  if (!id) throw new CustomError({ message: 'Usuário não existe', code: 404 });
  return Users.destroy({ where: { id } })
    .then((data) => {
      if (data === 1) return res.status(204).json('Usuário deletado.');
      throw new CustomError({ message: 'Usuário não existe', code: 404 });
    })
    .catch((err) => {
      throw new CustomError({ message: err.message, code: 500 });
    });
});

const login = rescue(async (req, res) => loginValidation.validateAsync(req.body)
  .then(() => Users.findOne({ where: { email: req.body.email } })
    .then((data) => {
      if (data && data.dataValues) {
        const newToken = token(data.dataValues);
        return res.status(200).json({ token: newToken });
      }
      throw new CustomError({ message: 'Campos inválidos', code: 400 });
    })
    .catch((err) => {
      throw new CustomError({ message: err.message, code: err.code });
    }))
  .catch((err) => {
    throw new CustomError({ message: err.message, code: err.code || 400 });
  }));

module.exports = {
  findAllUsers,
  addUser,
  findUserById,
  deleteUser,
  login,
};
