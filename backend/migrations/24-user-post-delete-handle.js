export async function up(queryInterface, DataTypes) {
  await queryInterface.removeColumn('UserPost', 'handle');
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.addColumn('UserPost', 'handle', {
    allowNull: true,
    type: DataTypes.STRING
  });
}
