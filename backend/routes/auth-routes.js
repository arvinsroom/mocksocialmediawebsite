const controller = require("../controllers/auth-controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/admin/login",
    controller.signInAdmin
  );

  app.get(
    "/api/admin/",
    [verifyToken, isAdmin]
  );
};
