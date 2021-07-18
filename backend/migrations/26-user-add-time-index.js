export async function up(queryInterface, DataTypes) {
  await queryInterface.addIndex('User', ['startedAt']);
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeIndex('User', ['startedAt']);
}
