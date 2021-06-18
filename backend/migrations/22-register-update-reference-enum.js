export async function up(queryInterface, DataTypes) {
  await queryInterface.changeColumn('Register', 'referenceName', {
    type: DataTypes.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER', 'HANDLE'),
    allowNull: false
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.changeColumn('Register', 'referenceName', {
    type: DataTypes.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER'),
    allowNull: false
  });
}
