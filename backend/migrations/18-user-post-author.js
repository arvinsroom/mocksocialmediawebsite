export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostAuthor');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostAuthor', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    authorName: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    authorVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    totalPosts: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    totalFollowing: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    totalFollower: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    pageId: {
      allowNull: false, // ???
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPostAuthor', ['authorId', 'pageId']);
}
