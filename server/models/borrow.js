module.exports = (sequelize, DataTypes) => {
  const Borrow = sequelize.define("Borrow", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ allow null for guest borrows
    },
    borrower_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    borrower_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    librarian_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    borrowed_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "borrowed",
    },
  });

  return Borrow;
};