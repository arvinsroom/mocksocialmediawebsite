export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn("Page", "omitInteractionBar");
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn("Page", "omitInteractionBar", {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  });
}
