async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostShare');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostShare', {
    // new post ID, when rendering data in future we should check all the entries from this table 
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    parentPostId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.INTEGER
    },
    shareText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  });
  // await queryInterface.addIndex('UserPostShare', ['userId', 'parentPostId']);
}

module.exports = {
  up,
  down
};