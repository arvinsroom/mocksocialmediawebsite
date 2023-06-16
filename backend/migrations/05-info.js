const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Info');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Info', {
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
    consent: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    isFinish: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    socialMediaPageId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: Sequelize.UUID
    }
  });
  await queryInterface.addIndex('Info', ['templateId', 'pageId']);
}

