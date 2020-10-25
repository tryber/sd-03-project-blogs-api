const { Router } = require('express');
const rescue = require('express-rescue');

const router = Router();
const services = require('../services');
const authMiddleware = require('../middlewares/AuthMiddleware');

router.post('/', authMiddleware, rescue(async (req, res, next) => {
  const payload = req.body;
  const data = req.user;

  const response = await services.PostServices.CreatePost(payload, data);
  if (response.error) return next(response.error);
  res.status(201).json({
    title: response.title,
    content: response.content,
    userId: response.userId,
  });
}));

router.get('/', authMiddleware, rescue(async (req, res) => {
  const response = await services.PostServices.GetAllPosts();
  res.status(200).json(response);
}));

router.get('/:id', authMiddleware, rescue(async (req, res, next) => {
  const postId = req.params.id;
  const response = await services.PostServices.GetPostById(postId);
  if (response.error) return next(response.error);
  res.status(200).json(response);
}));

module.exports = router;