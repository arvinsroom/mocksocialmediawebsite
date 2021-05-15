export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Register');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Register', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('TEXT', 'NUMBER', 'EMAIL', 'IMAGE', 'PASSWORD', 'DATE')
    },
    displayName: {
      allowNull: false,
      type: DataTypes.STRING // 255
    },
    required: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    referenceName: {
      allowNull: true,
      type: DataTypes.ENUM('PROFILEPHOTO', 'EMAIL', 'USERNAME', 'REALNAME', 'PASSWORD', 'DATE', 'NUMBER')
    },
    storeResponse: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    order: {
      allowNull: false,
      type: DataTypes.SMALLINT
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
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
  });
  await queryInterface.addIndex('Register', ['templateId', 'pageId']);
}

