const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Register');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Register', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    type: {
      allowNull: false,
      type: Sequelize.ENUM('TEXT', 'NUMBER', 'EMAIL', 'IMAGE', 'PASSWORD', 'DATE')
    },
    displayName: {
      allowNull: false,
      type: Sequelize.STRING // 255
    },
    required: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    referenceName: {
      allowNull: true,
      type: Sequelize.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER')
    },
    storeResponse: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    order: {
      allowNull: false,
      type: Sequelize.SMALLINT
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
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
      type: Sequelize.UUID
    },
  });
  await queryInterface.addIndex('Register', ['templateId', 'pageId']);
}

