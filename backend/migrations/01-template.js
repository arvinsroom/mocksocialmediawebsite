const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Template');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Template', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    adminId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Admin'
      },
      type: Sequelize.UUID
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    videoPermission: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    audioPermission: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    cookiesPermission: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    qualtricsId: {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    templateCode: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    language: {
      allowNull: true,
      type: Sequelize.STRING
    }
  });
  await queryInterface.addIndex('Template', ['adminId', 'templateCode']);
}

