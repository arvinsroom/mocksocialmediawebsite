const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserGlobalTracking');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserGlobalTracking', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    pageId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: Sequelize.UUID
    },
    activeTemplateId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
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
    pageMetaData: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('UserGlobalTracking', ['userId']);
}

