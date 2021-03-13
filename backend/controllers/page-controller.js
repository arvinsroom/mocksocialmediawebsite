import db from "../clients/database-client";
const Page = db.page;

// save a Info and return the _id for the Info created
const create = (req, res) => {
  if (!req.body.templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "Page name is required!"
    });
    return;
  }
  if (!req.body.type) {
    res.status(400).send({
      message: "Page type is required!"
    });
    return;
  }

  // form a info object with required information
  const page = {
    templateId: req.body.templateId,
    name: req.body.name,
    type: req.body.type,
  };
  
  Page.create(page)
    .then(data => {
      // return the id created
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Page record."
      });
    });
};


export default {
  create,
}