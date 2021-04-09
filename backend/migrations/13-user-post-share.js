async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostShare');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostShare', {
    // new post ID, when rendering data in future we should check all the entries from this table 
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
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
    parentUserPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    },
    parentAdminPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'AdminPost'
      },
      type: DataTypes.INTEGER
    },
    shareText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPostShare', ['userId']);
}

module.exports = {
  up,
  down
};