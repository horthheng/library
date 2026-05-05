module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Summary', {
    Student_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Student_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Student_Class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Student_Year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Book_Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Book_Label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'summary',
    timestamps: true
  });
};
