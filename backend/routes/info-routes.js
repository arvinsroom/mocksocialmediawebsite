
module.exports = app => {
  const info = require("../controllers/info-controller.js");
  
  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", info.create);

  app.use('/api/info', router);
};
