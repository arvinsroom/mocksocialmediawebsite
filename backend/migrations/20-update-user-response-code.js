export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('User', 'responseCode');
}

// 6 digit unique response code
export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('User', 'responseCode', {
    allowNull: true,
    type: DataTypes.INTEGER
  });
}
