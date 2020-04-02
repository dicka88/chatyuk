'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    time: DataTypes.STRING,
    user_id: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {
    freezeTableName: true,
    timestamps: false,
  	schema: 'chatyuk'
  });
  message.associate = function(models) {
    message.belongsTo(models.user)
  };
  return message;
};