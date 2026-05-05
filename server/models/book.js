module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    donated_by: DataTypes.STRING,
    public_year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    AuthorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Authors',
        key: 'id',
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Languages',
        key: 'id',
      },
    },
  });
  Book.associate = (models) => {
    Book.belongsTo(models.Author, { foreignKey: 'AuthorId' });
    Book.belongsTo(models.Category, { foreignKey: 'CategoryId' });
    Book.belongsTo(models.Language, { foreignKey: 'language_id' });
  };

  return Book;
};
