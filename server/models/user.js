export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY },
    phone: { type: DataTypes.STRING },
    profile_image: { type: DataTypes.STRING },
    barcode: { type: DataTypes.STRING },
    barcode_image: {
      type: DataTypes.STRING,
      allowNull: true, // image can be null for existing users
    },
    qr_code_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {  // <-- only one foreign key column here
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
  });
  return User;
};
