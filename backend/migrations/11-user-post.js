export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPost');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPost', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    adminPostId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE')
    },
    linkTitle: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    link: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    linkPreview: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    postMessage: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    isFake: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    sourceTweet: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    parentPostId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    },
    pageId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    userId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPost', ['userId', 'adminPostId', 'pageId', 'parentPostId']);
}

