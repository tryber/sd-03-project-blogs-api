// const createUserModel = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     displayName: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     image: DataTypes.STRING,
//   },
//   { timestamps: false });

//   User.associate = (models) => {
//     User.hasMany(models.Post, { as: 'Post', foreignKey: 'userId' });
//   };
//   return User;
// };

// module.exports = createUserModel;

const createUser = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false });

  user.associate = (models) => {
    user.hasMany(models.Post, { foreignKey: 'userId', as: 'Post' });
  };

  return user;
};

module.exports = createUser;
