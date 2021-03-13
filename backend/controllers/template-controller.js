import db from "../clients/database-client";
const Template = db.Template;

// save a template and return the _id for the template created
const create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Template name is required!"
    });
    return;
  }
  if (!req.body.type) {
    res.status(400).send({
      message: "Template Type is required!"
    });
    return;
  }
  // form a template object with required information
  const template = {
    name: req.body.name,
    videoPermission: req.body.videoPermission,
    audioPermission: req.body.audioPermission,
    cookiesPermission: req.body.cookiesPermission,
    randomPosts: req.body.randomPosts,
    type: req.body.type,
    flow: req.body.flow ? req.body.flow : "",
  };
  
  Template.create(template)
    .then(data => {
      // fetch json
      res.res({
        _id: data._id
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Template."
      });
    });
};

// for now we only need to update the flow
const update = (req, res) => {
  // get the id of template
  const _id = req.params._id;

  // form a template object with required information
  const template = {
    flow: req.body.flow,
  };
  
  Template.update(template, {
    where: {
      _id
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Template was successfully updated!"
        });
      } else {
        res.send({
          message: `Cannot update Template with _id=${_id}. Maybe Template was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Template with id=" + _id
      });
    });
};

export default {
  create,
  update
}