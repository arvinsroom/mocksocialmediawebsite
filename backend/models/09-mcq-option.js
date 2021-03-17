export default (sequelize, DataTypes) => {
	const McqOption = sequelize.define("McqOption", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    questionId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Question'
      },
      type: DataTypes.UUID
    },
    optionText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  McqOption.associate = (models) => {
    McqOption.hasOne(models.Question, {
      as: 'question',
      foreignKey: 'questionId'
    })
  };

  return McqOption;
}

