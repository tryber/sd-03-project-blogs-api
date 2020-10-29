const { Router } = require('express');
const userController = require('../controllers/user');
const validateJWT = require('../middlewares/validateJWT');

const user = Router();

user.route('/').get(validateJWT, userController.getAll).post(userController.createUser);

user.get('/:id', validateJWT, userController.getById);

user.delete('/me', validateJWT, userController.deleteUser);

module.exports = user;
