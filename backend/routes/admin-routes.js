module.exports = app => {
  const { createAdmin, findAdmin } = require("../controllers/admin-controller");

  var router = require("express").Router();

  // Create a new Admin
  router.post("/", createAdmin);

  // Retrieve a Admin
  router.get("/", findAdmin);

  app.use('/api/admin', router);
};
