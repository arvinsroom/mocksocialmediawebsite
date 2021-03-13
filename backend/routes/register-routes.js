
module.exports = app => {
  const template = require("../controllers/template-controller.js");
  
  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", template.create);

  app.use('/api/template', router);
};
