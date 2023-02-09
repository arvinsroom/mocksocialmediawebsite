const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('User');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('User', {
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
    qualtricsId: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    consent: {
      allowNull: true,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    startedAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
    finishedAt: {
      allowNull: true,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('User', ['templateId']);
}

