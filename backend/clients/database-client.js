import Admin from '../models/admin';
import Sequelize from 'sequelize';

var environment = 'local';
var config = require(__dirname + '/../config/config.json')[environment];

// get information about local or aws MYSQL credentials 
const connectionSetting = () => {
  return {
    database: config.database,
    host: config.host,
    username: config.username,
    password: config.password,
    port: config.port,
  };
};

const connSetting = connectionSetting();
const sequelize = new Sequelize({
  ...connSetting,
  dialect: config.dialect,
  logging: console.log
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// test the connection
testConnection();

const db = {};
const AdminModel = Admin(sequelize, Sequelize);
db[AdminModel.name] = AdminModel;


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
