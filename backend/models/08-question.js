export default (sequelize, DataTypes) => {
	const Question = sequelize.define("Question", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
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
      type: DataTypes.STRING(1024)
    },
    required: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Question.associate = (models) => {
    Question.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    });
    Question.hasMany(models.McqOption, {
      as: 'mcqOption',
      foreignKey: 'questionId'
    })
  };
  
  return Question;
}

