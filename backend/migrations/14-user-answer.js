const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserAnswer');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserAnswer', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: Sequelize.UUID
    },
    questionId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Question'
      },
      type: Sequelize.UUID
    },
    // this will have a reference to multiple rows in mcqAnswer
    // these entries are selected by user to be true
    mcqOptionId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'McqOption'
      },
      type: Sequelize.UUID
    },
    // against a userId and a questionId we should either have a simgle opentextAnswerText or
    // multiple or single mcqOptionId's 
    opentextAnswerText: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    finishedAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('UserAnswer', ['userId', 'questionId', 'mcqOptionId']);
}

