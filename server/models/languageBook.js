module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Language', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
