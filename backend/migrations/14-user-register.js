async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserRegister');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserRegister', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    profilePic: {
      allowNull: true,
      type: DataTypes.BLOB('long')
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING, // 255
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    mimeType: {
      allowNull: true,
      type: DataTypes.STRING
    },
  });
  await queryInterface.addIndex('UserRegister', ['userId']);
}

module.exports = {
  up,
  down
};