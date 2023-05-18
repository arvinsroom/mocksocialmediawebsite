const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Language');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Language', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING // 255
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
    platform: {
      allowNull: false,
      type: Sequelize.STRING
    },
    translations: {
      allowNull: false,
      type: Sequelize.TEXT
    }
  });
  await queryInterface.addIndex('Language', ['templateId', 'name', 'platform']);
}

