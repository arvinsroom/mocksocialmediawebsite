export default (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    qualtricsId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    consent: {
      allowNull: true,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    consentText: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    startedAt: {
      allowNull: true,
      type: DataTypes.DATE(3),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    },
    finishedAt: {
      allowNull: true,
      type: DataTypes.DATE(3),
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return User;
}
