import db from "../clients/database-client";
// get the admin model, we can perform operations on this
const Admin = db.Admin;

export const createAdmin = (req, res) => {
  // check if username is empty
  if (!req.body.username) {
    res.status(400).send({
      message: "Username cannot be empty!"
    });
    return;
  }
  // if if password is empty
  if (!req.body.password) {
    res.status(400).send({
      message: "Password cannot be empty!"
    });
    return;
  }

  // Create a Admin object
  const admin = {
    _id: req.body._id,
    username: req.body.username,
    password: req.body.password
  };

  // Save Admin object in the database
  Admin.create(admin)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Admin Username/Password."
      });
    });
};

export const findAdmin = (req, res) => {
  Admin.findOne({ where: { username: req.body.username, password: req.body.password } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin."
      });
    });
};
