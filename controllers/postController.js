const express = require('express');
const rescue = require('express-rescue');
const { User, Post } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const { validatePostData } = require('../services/validatePost');

const router = express.Router();

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id: userId } = req.user;

  const validation = await validatePostData(title, content);
  if (validation.error) {
    return res.status(validation.status).json({ message: validation.message });
  }

  const post = await Post.create({ title, content, userId });
  res.status(201).json(post);
};

const getPosts = async (_req, res) => {
  const posts = await Post.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });
  res.status(200).json(posts);
};

const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });
  if (!post) {
    return res.status(404).json({ message: 'Post não existe' });
  }
  res.status(200).json(post);
};

const updatePostById = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  const validation = await validatePostData(title, content);
  if (validation.error) {
    return res.status(validation.status).json({ message: validation.message });
  }

  const post = await Post.findByPk(id);
  console.log('POSTUP: ', post);
  if (!post) {
    return res.status(404).json({ message: 'Post não existe' });
  }

  const { id: userId } = req.user;
  if (post.userId !== userId) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  await Post.update({ title, content }, { where: { id } });
  const newPost = await Post.findOne({
    where: { id },
    attributes: { exclude: ['id', 'published', 'updated'] },
  });
  res.status(200).json(newPost);
};

const deletePostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ message: 'Post não existe' });
  }

  const { id: userId } = req.user;
  if (post.userId !== userId) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  await Post.destroy({ where: { id } });
  res.status(204).end();
};

router.post('/', authMiddleware, rescue(createPost));
router.get('/', authMiddleware, rescue(getPosts));
router.get('/:id', authMiddleware, rescue(getPostById));
router.put('/:id', authMiddleware, rescue(updatePostById));
router.delete('/:id', authMiddleware, rescue(deletePostById));

module.exports = router;
