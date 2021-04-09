import db from "../clients/database-client";
const Template = db.Template;

// save a template and return the _id for the template created
const create = async (req, res, next) => {
  // fetch the adminId added from middleware
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "Template name is required!"
    });
    return;
  }
  // if (!req.body.type) {
  //   res.status(400).send({
  //     message: "Template Type is required!"
  //   });
  //   return;
  // }
  // form a template object with required information
  const template = {
    name: req.body.name,
    videoPermission: req.body.requestVideo,
    audioPermission: req.body.requestAudio,
    cookiesPermission: req.body.requestCookies,
    // randomPosts: req.body.randomPosts,
    // type: req.body.type,
    flow: req.body.flow,
    qualtricsId: req.body.qualtricsId,
    adminId: req.adminId
  };
  // for each request have a transaction sequilize object to roll back if something goes wrong
  // necessary for nested links between tables
  let transaction;

  try {
    transaction = await db.sequelize.transaction();
    const data = await Template.create(template, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send({
      _id: data._id
    });
  } catch (error) {
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Template."
    });
  }
};

const getPrevTemplates = async (req, res, next) => {
  // fetch the adminId added from middleware
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }

  try {
    const data = await Template.findAll({
      where: {
        adminId: req.adminId
      },
      // attributes: ['_id', 'name', 'type']
      attributes: ['_id', 'name']
    });
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching templates for current user."
    });
  }
};

const deletePrevTemplate = async (req, res, next) => {
  // fetch the adminId added from middleware
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }

  // fetch template _id from params
  const _id = req.params._id;
  if (!_id) {
    res.status(400).send({
      message: "Invalid Template Id!"
    });
    return;
  }

  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const data = await Template.destroy({
      where: {
        _id
      },
      transaction
    });
    await transaction.commit();

    res.send("Template was successfully deleted.");
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while deleting given template."
    });
  }
};

export default {
  create,
  getPrevTemplates,
  deletePrevTemplate,
}