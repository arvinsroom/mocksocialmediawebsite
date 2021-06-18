export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('UserPostAuthor', 'handle', {
    allowNull: true,
    type: DataTypes.STRING
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('UserPostAuthor', 'handle');
}
