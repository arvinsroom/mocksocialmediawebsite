const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('McqOption');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('McqOption', {
    _id: {
      allowNull: false,
      primaryKey: true,
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
    optionText: {
      allowNull: false,
      type: Sequelize.STRING
    },
    optionOrder: {
      allowNull: false,
      type: Sequelize.SMALLINT
    },
  });
  await queryInterface.addIndex('McqOption', ['questionId']);
}

