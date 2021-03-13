import db from "../clients/database-client";
const FinishScreen = db.FinishScreen;

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
  const finishScreen = {
    templateId: req.body.templateId,
    text: req.body.text,
    pageId: req.body.pageId,
    redirectionLink: req.body.redirectionLink,
  };
  
  FinishScreen.create(finishScreen)
    .then(data => {
      // return the id created
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Finsh Screen record for this table."
      });
    });
};


export default {
  create,
}