'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: DataTypes.STRING,
    login: DataTypes.STRING,
    name: DataTypes.STRING,
    github: DataTypes.STRING,
    path_photo: DataTypes.STRING,
    registered: DataTypes.TIME,
  }, {
    freezeTableName: true,
    timestamps: false,
    schema: 'chatyuk'
  });
  user.associate = function(models) {
    user.hasMany(models.message, { onDelete: 'CASCADE' })
  };
  return user;
};