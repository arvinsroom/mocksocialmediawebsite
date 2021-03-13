export default (sequelize, DataTypes) => {
	const UserAnswer = sequelize.define("UserAnswer", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    questionId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Question'
      },
      type: DataTypes.UUID
    },
    // this will have a reference to multiple rows in mcqAnswer
    // these entries are selected by user to be true
    mcqOptionId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'McqOption'
      },
      type: DataTypes.UUID
    },
    // against a userId and a questionId we should either have a simgle opentextAnswerText or
    // multiple or single mcqOptionId's 
    opentextAnswerText: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return UserAnswer;
}
