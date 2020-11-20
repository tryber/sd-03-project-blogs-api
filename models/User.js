const User = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      displayName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
    },

    {
      timestamps: false,
    },
  );

  user.associate = (models) => {
    user.hasMany(models.Post, {
      foreignKey: 'userId', as: 'user',
    });
  };

  return user;
};

module.exports = User;
