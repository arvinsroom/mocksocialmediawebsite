export default (sequelize, DataTypes) => {
	const FinishScreen = sequelize.define("FinishScreen", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    text: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    redirectionLink: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    }
    // also output _id of user table for further analysis, everything should be connected to that id
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return FinishScreen;
}
