export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('UserPost', 'likedBy', {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('UserPost', 'likedByOverflow', {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('UserPost', 'retweetedBy', {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('UserPost', 'retweetedByOverflow', {
    allowNull: true,
    type: DataTypes.STRING
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('UserPost', 'likedBy');
  await queryInterface.removeColumn('UserPost', 'likedByOverflow');
  await queryInterface.removeColumn('UserPost', 'retweetedBy');
  await queryInterface.removeColumn('UserPost', 'retweetedByOverflow');
}
