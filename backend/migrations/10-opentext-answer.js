async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('OpentextAnswer');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('OpentextAnswer', {
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
    answerText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  });
  await queryInterface.addIndex('OpentextAnswer', ['questionId', 'isCorrectMcq']);
}

module.exports = {
  up,
  down
};