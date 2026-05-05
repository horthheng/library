// models/auditlog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM("update_user", "delete_user", "suspend_user", "activate_user"),
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: false,
    }
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { as: "Admin", foreignKey: "adminId" });
    AuditLog.belongsTo(models.User, { as: "TargetUser", foreignKey: "userId" });
  };


  return AuditLog;
};
