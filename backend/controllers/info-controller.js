import db from "../clients/database-client";
const Info = db.Info;

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
  const info = {
    templateId: req.body.templateId,
    richText: req.body.richText,
    pageId: req.body.pageId,
  };
  
  Info.create(info)
    .then(data => {
      // return the id created
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Info record."
      });
    });
};

const findOne = (req, res) => {
  const _id = req.params._id;

  Info.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

export default {
  create,
  findOne
}