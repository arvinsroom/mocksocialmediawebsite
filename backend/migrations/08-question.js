const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Question');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Question', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    pageId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: Sequelize.UUID
    },
    questionText: {
      allowNull: false,
      type: Sequelize.STRING
    },
    required: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    multiResponse: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    order: {
      allowNull: false,
      type: Sequelize.SMALLINT
    }
  });
  await queryInterface.addIndex('Question', ['pageId']);
}

