const { Router } = require('express');
const rescue = require('express-rescue');

const router = Router();
const services = require('../services');
const authMiddleware = require('../middlewares/AuthMiddleware');

router.post('/', rescue(async (req, res, next) => {
  const payload = req.body;
  const response = await services.UserServices.CreateUser(payload);
  if (response.error) return next(response.error);
  res.status(201).json({ token: response.token });
}));

router.get('/', authMiddleware, rescue(async (req, res) => {
  const { dataValues } = req.user;
  if (dataValues) {
    const users = await services.UserServices.GetUsers();
    res.status(200).json(users);
  }
}));

router.get('/:id', authMiddleware, rescue(async (req, res, next) => {
  const pk = req.params.id;
  const response = await services.UserServices.GetUserById(pk);
  if (response.error) return next(response.error);
  res.status(200).json(response);
}));

router.delete('/me', authMiddleware, rescue(async (req, res) => {
  const toDelete = req.user;
  await services.UserServices.DeleteUser(toDelete.email);
  res.status(204).json();
}));

module.exports = router;
