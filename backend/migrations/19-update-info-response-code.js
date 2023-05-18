const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('Info', 'showResponseCode');
}

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('Info', 'showResponseCode', {
    allowNull: true,
    type: Sequelize.BOOLEAN
  });
}
