module.exports = app => {
  const finishScreen = require("../controllers/finish-screen-controller.js");
  
  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", finishScreen.create);

  app.use('/api/finishscreen', router);
};
