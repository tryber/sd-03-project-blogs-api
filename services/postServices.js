const { Op } = require('sequelize');
const { Post, User } = require('../models');

const createPost = async (title, content, userId) => {
  if (!title) return { status: 400, message: '"title" is required' };
  if (!content) return { status: 400, message: '"content" is required' };

  await Post.create({ title, content, userId });

  return { title, content, userId };
};

const getAllPosts = async () => {
  const posts = await Post.findAll({ include: [{ model: User, as: 'user', attributes: { exclude: 'password' } }] });

  return posts;
};

const getPostId = async (id) => {
  const post = await Post.findOne({ where: { id }, include: [{ model: User, as: 'user', attributes: { exclude: 'password' } }] });

  if (!post) return { status: 404, message: 'Post não existe' };

  return post;
};

const changePost = async (title, content, id, userId) => {
  if (!title) return { status: 400, message: '"title" is required' };
  if (!content) return { status: 400, message: '"content" is required' };

  let post = await Post.findOne({ where: { id } });

  if (post.userId !== userId) return { status: 401, message: 'Usuário não autorizado' };

  await Post.update({ title, content }, { where: { id } });

  post = await Post.findOne({ where: { id } });

  return post;
};

const searchPost = async (q) => {
  const post = await Post.findAll({
    where: { [Op.or]: [{ title: { [Op.like]: `%${q}%` } }, { content: { [Op.like]: `%${q}%` } }] },
    include: [{ model: User, as: 'user', attributes: { exclude: 'password' } }],
  });

  return post;
};

const deletePost = async (id, userId) => {
  let post = await Post.findOne({ where: { id } });

  if (!post) return { status: 404, message: 'Post não existe' };
  if (post.userId !== userId) return { status: 401, message: 'Usuário não autorizado' };

  await Post.destroy({ where: { id } });

  post = await Post.findOne({ where: { id } });

  if (post) return { status: 404, message: 'Post não deletado' };

  return { status: false };
};

module.exports = {
  createPost,
  getAllPosts,
  getPostId,
  changePost,
  searchPost,
  deletePost,
};
