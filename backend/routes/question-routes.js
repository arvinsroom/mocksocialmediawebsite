
module.exports = app => {
  const questions = require("../controllers/question-controller.js");
  
  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", questions.create);

  app.use('/api/questions', router);
};
