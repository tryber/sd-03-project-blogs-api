const { User } = require('../models');

const validateName = (displayName) => {
  if (displayName.length < 8) return { error: { message: '"displayName" length must be at least 8 characters long', statusCode: 400 } };

  return null;
};

const emailUnicyValidation = async (email) => {
  const sameEmail = await User.findAll({ where: { email } });

  if (sameEmail.length > 0) return false;

  return true;
};

const validateEmail = async (email) => {
  if (!email) return { error: { message: '"email" is required', statusCode: 400 } };
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  const isEmailValid = emailPattern.test(email);
  if (!isEmailValid) return { error: { message: '"email" must be a valid email', statusCode: 400 } };
  const emailUnicy = await emailUnicyValidation(email);
  if (!emailUnicy) return { error: { message: 'Usuário já existe', statusCode: 409 } };
};

const validatePassword = (password) => {
  if (!password) return { error: { message: '"password" is required', statusCode: 400 } };
  if (password.length < 6) return { error: { message: '"password" length must be 6 characters long', statusCode: 400 } };

  return null;
};

const validateUser = async (displayName, email, password) => {
  const pwdValidation = validatePassword(password);
  if (pwdValidation) return pwdValidation;

  const nameValidation = validateName(displayName);
  if (nameValidation) return nameValidation;

  const emailValidation = await validateEmail(email);
  if (emailValidation) return emailValidation;

  return true;
};

const createUser = async (displayName, email, password, image) => {
  const userValidation = await validateUser(displayName, email, password);
  if (userValidation.error) return userValidation;
  const newUser = await User.create({ displayName, email, password, image });
  return newUser;
};

const login = async (email, password) => {
  if (!email && email !== '') return { error: { message: '"email" is required', statusCode: 400 } };
  if (!password && password !== '') return { error: { message: '"password" is required', statusCode: 400 } };
  if (email === '') {
    return { error: { message: '"email" is not allowed to be empty', statusCode: 400 } };
  }
  if (password === '') {
    return { error: { message: '"password" is not allowed to be empty', statusCode: 400 } };
  }
  const verifyUser = await User.findOne({ where: { email, password: password.toString() } });
  if (verifyUser === null) return { error: { message: 'Campos inválidos', statusCode: 400 } };
  return verifyUser;
};

const getAll = async () => {
  const response = await User.findAll();
  return response;
};

const getById = async (id) => {
  const response = await User.findOne({ where: { id } });

  if (response === null) return { error: { message: 'Usuário não existe', statusCode: 404 } };

  return response;
};

const deleteUser = async (id) => {
  await User.destroy({ where: { id } });
  return true;
};

module.exports = { createUser, login, getAll, getById, deleteUser };
