export async function down(queryInterface, DataTypes) {
  await queryInterface.changeColumn("UserPost", "adminPostId", {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "authorId", {
    type: DataTypes.INTEGER
  });
  await queryInterface.changeColumn("UserPostAuthor", "authorId", {
    allowNull: false,
    type: DataTypes.INTEGER
  });
  await queryInterface.changeColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: DataTypes.INTEGER
  });
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.changeColumn("UserPost", "adminPostId", {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.changeColumn("UserPost", "authorId", {
    type: DataTypes.STRING
  });
  await queryInterface.changeColumn("UserPostAuthor", "authorId", {
    allowNull: false,
    type: DataTypes.STRING
  });
  await queryInterface.changeColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: DataTypes.STRING
  });
}
