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
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    optionOrder: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.SMALLINT
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  McqOption.associate = (models) => {
    McqOption.belongsTo(models.Question, {
      as: 'question',
      foreignKey: 'questionId'
    })
  };

  return McqOption;
}

