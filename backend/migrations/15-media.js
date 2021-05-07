export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Media');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Media', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    mimeType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    media: {
      allowNull: false,
      type: DataTypes.BLOB('long')
    },
    isThumbnail: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    userPostId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    }
  });
  await queryInterface.addIndex('Media', ['userPostId']);
}

