const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Finish');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Finish', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
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
    text: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    redirectionLink: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    }
    // also output _id of user table for further analysis, everything should be connected to that id
  });
  await queryInterface.addIndex('Finish', ['templateId', 'pageId']);
}

