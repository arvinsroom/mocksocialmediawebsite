const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('User', 'responseCode');
}

// 6 digit unique response code
export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('User', 'responseCode', {
    allowNull: true,
    type: Sequelize.INTEGER
  });
}
