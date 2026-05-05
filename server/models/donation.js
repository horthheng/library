module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Donation', {
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    cover_image: DataTypes.STRING,
    language: DataTypes.STRING,
    author: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};