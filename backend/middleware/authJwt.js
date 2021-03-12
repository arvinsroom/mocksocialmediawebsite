import db from "../clients/database-client";
const jwt = require("jsonwebtoken");
const secret = require(__dirname + '/../config/config.json')['secret'];
const Admin = db.Admin;

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    console.log('decoded.id'. decoded._id);
    req.adminId = decoded._id;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  Admin.findByPk(req.adminId)
    .then(() => {
      return res.status(200).send({
        access: 'OK'
      });
  })
  .catch(err => {
    return res.status(403).send({
      message: "No admin user exit with provided token!" + toString(err)
    });
  });
};