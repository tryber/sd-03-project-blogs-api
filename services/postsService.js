const { Post } = require('../models');

const createPost = async (title, content, id) => {
  if (!title) return { error: { message: '"title" is required', statusCode: 400 } };
  if (!content) return { error: { message: '"content" is required', statusCode: 400 } };
  const post = await Post.create({ title, content, userId: id });
  return post;
};

module.exports = {
  createPost,
};
