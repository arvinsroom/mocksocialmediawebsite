import db from "../clients/database-client";
const jwt = require("jsonwebtoken");
let secret;
try {
  secret = require(__dirname + '/../config-' + process.env.NODE_ENV.toString() + '.json')['secretUser'];
} catch (error) {
  console.log('Please specify a config-production.json or config-development.json file!')
}

export const verifyUserToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided, Please log in again!"
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded._id;
    next();
  });
};

export const isUser = (req, res, next) => {
  db.User.findByPk(req.userId)
    .then(() => {
      next();
  })
  .catch(err => {
    return res.status(403).send({
      message: "No User entry found, Plese log in again! " + toString(err)
    });
  });
};