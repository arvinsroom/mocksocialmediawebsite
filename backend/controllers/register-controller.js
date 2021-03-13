import db from "../clients/database-client";
const Register = db.Register;

// save a Info and return the _id for the Info created
const create = (req, res) => {
  if (!req.body.templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!req.body.pageId) {
    res.status(400).send({
      message: "Page Id is required!"
    });
    return;
  }

  // form a info object with required information
  const register = {
    templateId: req.body.templateId,
    profilePic: req.body.profilePic,
    pageId: req.body.pageId,
    username: req.body.username,
  };
  
  Register.create(register)
    .then(data => {
      // return the id created
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Register record."
      });
    });
};


export default {
  create,
}