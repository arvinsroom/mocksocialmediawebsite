import Sequelize from 'sequelize';

import Admin from '../models/00-admin';
import Template from '../models/01-template';
import Language from '../models/03-language';
import AdminPost from '../models/04-admin-post';
import Page from '../models/02-page';
import Info from '../models/05-info';
import Finish from '../models/06-finish';
import Register from '../models/07-register';
import Question from '../models/08-question';
import McqOption from '../models/09-mcq-option';
import User from '../models/10-user';
import UserPost from '../models/11-user-post';
import UserPostAction from '../models/12-user-post-action';
import UserPostShare from '../models/13-user-post-share';
import UserRegister from '../models/14-user-register';
import UserAnswer from '../models/15-user-answer';
import Media from '../models/16-media';
import UserPostTracking from '../models/17-user-post-tracking';
import UserGlobalTracking from '../models/18-user-global-tracking';

const mysql = require('mysql2/promise');

let config;
try {
  config = require(__dirname + '/../config-' + process.env.NODE_ENV.toString() + '.json')['database'];
} catch (error) {
  console.log('Please specify a config-production.json or config-development.json file!')
}

const checkDatabase = async () => {
  console.log('Checking if database exit...')
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      debug: false
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.name}\`;`);
    console.log('Database has successfully checked/created.');
    await connection.end();
    console.log('Closed MYSQL connection, and starting sequilize MYSQL connection...');
  } catch (error) {
    console.error('Unable to check/create a database: ', error);
  }
};

// check to if database exist or not, if not then create it
checkDatabase();

// get information about local or aws MYSQL credentials 
const connectionSetting = () => {
  return {
    database: config.name,
    host: config.host,
    username: config.username,
    password: config.password,
    port: config.port,
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0,
    },
  };
};

const connSetting = connectionSetting();
const sequelize = new Sequelize({
  ...connSetting,
  dialect: config.dialect,
  // timezone: '-05:00', // utc, but let the original time be in Universal Coordinated Time
  // logging: (...msg) => console.log(msg),
  logging: console.log,
  // timezone: "+00:00" // when returning
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequilize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// test the connection
testConnection();

const db = {};
const AdminModel = Admin(sequelize, Sequelize);
const TemplateModel = Template(sequelize, Sequelize);
const LanguageModel = Language(sequelize, Sequelize);
const AdminPostModel = AdminPost(sequelize, Sequelize);
const PageModel = Page(sequelize, Sequelize);
const InfoModel = Info(sequelize, Sequelize);
const FinishModel = Finish(sequelize, Sequelize);
const RegisterModel = Register(sequelize, Sequelize);
const QuestionModel = Question(sequelize, Sequelize);
const McqOptionModel = McqOption(sequelize, Sequelize);
const UserModel = User(sequelize, Sequelize);
const UserPostModel = UserPost(sequelize, Sequelize);
const UserPostActionModel = UserPostAction(sequelize, Sequelize);
const UserPostShareModel = UserPostShare(sequelize, Sequelize);
const UserRegisterModel = UserRegister(sequelize, Sequelize);
const UserAnswerModel = UserAnswer(sequelize, Sequelize);
const MediaModel = Media(sequelize, Sequelize);
const UserPostTrackingModel = UserPostTracking(sequelize, Sequelize);
const UserGlobalTrackingModel = UserGlobalTracking(sequelize, Sequelize);

db[AdminModel.name] = AdminModel;
db[TemplateModel.name] = TemplateModel;
db[LanguageModel.name] = LanguageModel;
db[AdminPostModel.name] = AdminPostModel;
db[PageModel.name] = PageModel;
db[InfoModel.name] = InfoModel;
db[FinishModel.name] = FinishModel;
db[RegisterModel.name] = RegisterModel;
db[QuestionModel.name] = QuestionModel;
db[McqOptionModel.name] = McqOptionModel;
db[UserModel.name] = UserModel;
db[UserPostModel.name] = UserPostModel;
db[UserPostActionModel.name] = UserPostActionModel;
db[UserPostShareModel.name] = UserPostShareModel;
db[UserRegisterModel.name] = UserRegisterModel;
db[UserAnswerModel.name] = UserAnswerModel;
db[MediaModel.name] = MediaModel;
db[UserPostTrackingModel.name] = UserPostTrackingModel;
db[UserGlobalTrackingModel.name] = UserGlobalTrackingModel;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
