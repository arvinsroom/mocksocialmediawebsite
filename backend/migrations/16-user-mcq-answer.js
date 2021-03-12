async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserMcqAnswer');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserMcqAnswer', {
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
    // this will have a reference to multiple rows in mcqAnswer
    // these entries are selected by user to be true
    mcqAnswerId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'McqAnswer'
      },
      type: DataTypes.UUIDV4
    }
  });
  await queryInterface.addIndex('UserMcqAnswer', ['userId', 'questionId']);
}

module.exports = {
  up,
  down
};