const createPost = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
  },
  {
    timestamps: true,
    createdAt: 'published',
    updatedAt: 'updated',
    deletedAt: false,
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User,
      { foreignKey: 'userId', as: 'user' });
  };

  return Post;
};

module.exports = createPost;
