export default (sequelize, DataTypes) => {
	const Question = sequelize.define("FinishScreen", {
    _id: {
      allowNull: false,
      primaryKey: true,
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
    questionText: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    required: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return Question;
}

