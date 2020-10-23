const Boom = require('boom');
const rescue = require('express-rescue');

const createPost = ({ Post }) => rescue(async (req, res, next) => {
  const { title, content } = req.body;
  const { id: userId } = req.user;

  const { message } = await Post.validate({ title, content });
  if (message) return next(Boom.badRequest(message));
  console.log(title, content);
  const post = await Post.createPost({ title, content, userId });
  res.status(201).json({ ...post });
});

const getAllPosts = ({ Post }) => rescue(async (_req, res) => {
  const posts = await Post.getAllPosts();
  return res.status(200).json(posts);
});

const getPostById = ({ Post }) => rescue(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.getPostById(id);
  if (post.message) return next(Boom.notFound(post.message));

  return res.status(200).json({ ...post });
});

const updatePost = ({ Post }) => rescue(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { user: { id: userId } } = req.post;

  const { message } = await Post.validate({ title, content });
  if (message) return next(Boom.badRequest(message));

  await Post.updatePostById(id, { title, content });

  return res.status(200).json({ title, content, userId });
});

const userOwnerShip = ({ Post }) => (restrict = true) => rescue(async (req, _res, next) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const post = await Post.getPostById(id);
  if (post.message) return next(Boom.notFound(post.message));
  if (post.user.id !== userId && restrict) {
    return next(Boom.unauthorized('Usuário não autorizado'));
  }

  req.post = post;
  return next();
});

const deletePost = ({ Post }) => rescue(async (req, res) => {
  const { id } = req.params;
  await Post.deletePostById(id);
  return res.status(204).end();
});

const search = ({ Post }) => rescue(async (req, res) => {
  const { q } = req.query;
  const posts = await Post.search(q);
  return res.status(200).json(posts);
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  userOwnerShip,
  search,
};
