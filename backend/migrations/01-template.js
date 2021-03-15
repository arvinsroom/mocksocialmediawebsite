async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Template');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Template', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    randomPosts: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('FACEBOOK') // 'REDDIT', 'TWITTER', 'INSTAGRAM'
    },
    videoPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    audioPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    cookiesPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    qualtricsId: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    // flow?? is a {
    //   type: 'of component',
    //   _id: 'reference to know what to fetch',
    // }
    flow: {
      allowNull: true,
      type: DataTypes.TEXT, // json object implement sutible getter and setters, if needed
    }
  });
  // await queryInterface.addIndex('Template', ['type', 'name']);
}

module.exports = {
  up,
  down
};