const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Admin');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Admin', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    }
  });
  await queryInterface.addIndex('Admin', ['username'])
}

