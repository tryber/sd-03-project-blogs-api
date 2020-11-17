const createdPost = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, { createdAt: 'published', updatedAt: 'updated' });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: 'user', foreignKey: 'id' });
  };

  return Post;
};

module.exports = createdPost;
