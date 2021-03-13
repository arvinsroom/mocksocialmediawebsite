import * as express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  umzugUp,
  umzugDown
} from './migrations';
import db from "./clients/database-client";
// get the admin model, we can perform operations on this
const Admin = db.Admin;
var bcrypt = require("bcryptjs");

// TODO: This should be removed before we go live or production
// This will drop every single table
try {
  // await umzugDown();
  console.log('Tables Droped, Migrations ran successfully!');
} catch (err) {
  console.log(err);
}

// Later we will use the migrations folder to add any new change to the mysql table
// example: https://github.com/abelnation/sequelize-migration-hello/blob/master/migrations/01_UserEyeColorAdded.js
// This will run all the migrations again
try {
  await umzugUp();
  console.log('Tables Created, Migrations ran successfully!');

  console.log('Trying to inserting entries for admin user in the database from config.json!');
  // before starting add entries for admin user in the database, only push the first one
  const config = require(__dirname + '/config/config.json')['adminCredentials'][0];
  console.log(config);
  // Save Admin object from config to the database
  const admin = {
    username: config.username,
    password: bcrypt.hashSync(config.password, 8)
  };
  // Save Admin object in the database
  // Admin.create(admin)
  // .then(data => {
  //   console.log('User Created: ', data);
  // })
  // .catch(err => {
  //   console.log("Some error occurred while creating the Admin Username/Password.", err);
  // });

  // create a express server
  const app = express();

  var corsOptions = {
    origin: '*'//"http://localhost:8081"
  };

  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(bodyParser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // simple route
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Mock Website application."
    });
  });

  require("./routes/auth-routes")(app);
  require("./routes/template-routes")(app);


  // set port, listen for requests
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch (err) {
  console.log('Error: ', err);
  process.exit(1);
}
