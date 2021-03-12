async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('McqAnswer');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('McqAnswer', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    questionId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Question'
      },
      type: DataTypes.UUIDV4
    },
    isCorrect: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    answerText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  });
  await queryInterface.addIndex('McqAnswer', ['questionId', 'isCorrectMcq']);
}

module.exports = {
  up,
  down
};