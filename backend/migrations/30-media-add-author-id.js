export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn("Media", "authorId");
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: DataTypes.STRING,
  });
}
