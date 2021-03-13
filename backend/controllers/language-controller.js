import db from "../clients/database-client";
const Language = db.Language;

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
      message: "Language name is required!"
    });
    return;
  }
  if (!req.body.translations) {
    res.status(400).send({
      message: "Language translations are required!"
    });
    return;
  }

  // form a info object with required information
  const language = {
    templateId: req.body.templateId,
    name: req.body.name,
    code: req.body.code,
    translations: req.body.translations,
  };
  
  Language.create(language)
    .then(data => {
      // return the id created
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Language record(s)."
      });
    });
};

export default {
  create,
}
