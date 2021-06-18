export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('Info', 'showResponseCode');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('Info', 'showResponseCode', {
    allowNull: true,
    type: DataTypes.BOOLEAN
  });
}
