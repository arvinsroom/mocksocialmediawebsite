/* eslint-disable import/no-anonymous-default-export */
import { Sequelize } from 'sequelize';

export default function (sequelize) {
	const Admin = sequelize.define("Admin", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING(36)
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING(36)
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING(36)
    }
  }, {
		tableName: "Admin",
		freezeTableName: true
	});

	return Admin;
}
