async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserRegister');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserRegister', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    profilePic: {
      allowNull: true,
      type: DataTypes.BLOB
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING, // 255
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUIDV4
    },
    // need started at stamp
  });
  await queryInterface.addIndex('UserRegister', ['userId', 'username']);
}

module.exports = {
  up,
  down
};