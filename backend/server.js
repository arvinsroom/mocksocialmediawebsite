import * as express from "express";
import cors from "cors";
import { umzugUp } from './migrations';
import db from "./clients/database-client";

import auth from './routes/auth-routes';
import authUser from './routes/user-auth-routes';

import template from './routes/template-routes';
import register from './routes/register-routes';
import finish from './routes/finish-routes';
import info from './routes/info-routes';
import question from './routes/question-routes';
import media from './routes/media-routes';
import language from './routes/language-routes';
import page from './routes/page-routes';
import metrics from './routes/admin-metrics-routes';
import adminUserPost from './routes/admin-userpost-routes';

import userRegister from './routes/user-register-routes';
import userFinish from './routes/user-finish-routes';
import userInfo from './routes/user-info-routes';
import userFacebook from './routes/facebook-routes';
import userQuesion from './routes/user-question-routes';
import userAnswer from './routes/user-answer-routes';
import userMain from './routes/user-main-routes';
import userTracking from './routes/user-tracking-routes';
import { databaseConfigurations, adminCredConfigurations } from './utils';

const mysql = require('mysql2/promise');

const bcrypt = require("bcryptjs");
const { verifyToken, isAdmin } = require("./middleware/authJwt");
const { verifyUserToken, isUser } = require("./middleware/userAuthJwt");
const fs = require('fs')

const checkConfigFileExist = () => {
  const pathToConfigFile = __dirname + '/config-' + process.env.NODE_ENV.toString() + '.json';
  try {
    if (fs.existsSync(pathToConfigFile)) {
      console.log(`Config file ${pathToConfigFile} exist!`);
    } else {
      console.log(`Config file ${pathToConfigFile} doesn\'t exist!`);
    }
  } catch(err) {
    console.error('Please provide a config-production.json or config-development.json file!', err)
  }
}

const testConnection = async () => {
  console.log('Checking if database exist...');
  try {
    let databaseConfig = databaseConfigurations();
    console.log('Opening connection...');
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.username,
      password: databaseConfig.password,
      debug: false
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.name}\`;`);
    console.log('Database has been successfully checked and/or created.');
    await connection.end();
    console.log('Connection closed!');
  } catch (error) {
    console.error('Exiting... Unable to check and/or create a database: ', error);
    process.exit(1);
  }
}


const checkAndCreateAdmins = async () => {
  let transaction;
  try {
    let config = adminCredConfigurations();
    transaction = await db.sequelize.transaction();
    let promisses = [];
    // Save Admin object from config to the database
    if (config && config instanceof Array) {
      for (let i = 0; i < config.length; i++) {
        // check if user with the username exist, if it exist do not do anything
        const data = await db.Admin.findOne({
          where: {
            username: config[i].username
          }
        });
        if (data) console.log(`Skipping user with name ${config[i].username} as it already exist`);
        else {
          const admin = {
            username: config[i].username,
            password: bcrypt.hashSync(config[i].password, 8)
          };
          promisses.push(db.Admin.create(admin, { transaction }));
          console.log(`Creating Admin with username: ${config[i].username}`);
        }
      }
    }
    await Promise.all(promisses);
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    console.log("All admin credentials created!");
  } catch (error) {
    console.log("Some error occured whicle creating admin credentials: ", error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    console.log("Rolled back all admin credentials!");
  }
};

// Later we will use the migrations folder to add any new change to the mysql table
// example: https://github.com/abelnation/sequelize-migration-hello/blob/master/migrations/01_UserEyeColorAdded.js
// This will run all the migrations again
try {
  await checkConfigFileExist();

  await testConnection();

  await umzugUp();
  console.log('Tables Created, Migrations ran successfully!');

  console.log('Trying to inserting entries for admin credentials in the database!');
  await checkAndCreateAdmins();

  // create a express server
  const app = express();
  const environment = process.env.NODE_ENV;
  // 8080 is for local development
  // origin: 'http://localhost:8080'
  // no port or 80 is for local development using decker dec
  // origin: 'http://localhost'
  var corsOptions = {
    origin: environment === 'development' ? ['http://localhost', 'http://localhost:8080'] : ['https://studysocial.media', 'https://www.studysocial.media'],
  };

  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({
    extended: true
  }));

  // add middleware where we check of x-access-token with each request
  // in future maybe add this on on specific admin routes
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // simple route
  // we do not need middleware here as admin is trying to log in
  app.use('/api/admin/login', auth);
  app.use('/api/user/login', authUser);

  // add middleware to our application
  app.use('/api/template', [verifyToken, isAdmin], template);
  app.use('/api/register', [verifyToken, isAdmin], register);
  app.use('/api/info', [verifyToken, isAdmin], info);
  app.use('/api/finish', [verifyToken, isAdmin], finish);
  app.use('/api/questions', [verifyToken, isAdmin], question);
  app.use('/api/language', [verifyToken, isAdmin], language);
  app.use('/api/page', [verifyToken, isAdmin], page);
  app.use('/api/media', [verifyToken, isAdmin], media);
  app.use('/api/metrics', [verifyToken, isAdmin], metrics);
  app.use('/api/userposts', [verifyToken, isAdmin], adminUserPost);

  app.use('/api/user/questions', [verifyUserToken, isUser], userQuesion);
  app.use('/api/user/answer', [verifyUserToken, isUser], userAnswer);
  app.use('/api/user/register', [verifyUserToken, isUser], userRegister);
  app.use('/api/user/finish', [verifyUserToken, isUser], userFinish);
  app.use('/api/user/info', [verifyUserToken, isUser], userInfo);
  app.use('/api/user/facebook', [verifyUserToken, isUser], userFacebook);
  app.use('/api/user/main', [verifyUserToken, isUser], userMain);
  app.use('/api/user/tracking', [verifyUserToken, isUser], userTracking);

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch (error) {
  console.log('Error: ', error);
  process.exit(1);
}
