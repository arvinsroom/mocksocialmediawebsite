const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('Register', 'referenceName', {
    type: Sequelize.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER', 'HANDLE', 'RELATIONSHIP'),
    allowNull: false
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('Register', 'referenceName', {
    type: Sequelize.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER', 'HANDLE'),
    allowNull: false
  });
}
