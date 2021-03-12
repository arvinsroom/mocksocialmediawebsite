async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserOpentextAnswer');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserOpentextAnswer', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
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
      allowNull: false,
      type: DataTypes.TEXT
    }
  });
  await queryInterface.addIndex('UserOpentextAnswer', ['userId', 'questionId']);
}

module.exports = {
  up,
  down
};