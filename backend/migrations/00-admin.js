export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Admin');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Admin', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });
  await queryInterface.addIndex('Admin', ['username'])
}

