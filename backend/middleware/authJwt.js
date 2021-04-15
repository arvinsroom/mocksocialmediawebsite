import db from "../clients/database-client";
const jwt = require("jsonwebtoken");
let secret;
try {
  secret = require(__dirname + '/../config-' + process.env.NODE_ENV.toString() + '.json')['secret'];
} catch (error) {
  console.log('Please specify a config-production.json or config-development.json file!')
}

export const verifyToken = (req, res, next) => {
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
    req.adminId = decoded._id;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  db.Admin.findByPk(req.adminId)
    .then(() => {
      next();
      // return res.status(200).send({
      //   access: 'OK'
      // });
  })
  .catch(err => {
    return res.status(403).send({
      message: "No admin user exit with provided token, Plese log in again!" + toString(err)
    });
  });
};