import db from "../clients/database-client";
const Template = db.Template;

// will mostly run once
const checkExistAndReturnTemplateCode = async (transaction) => {
  // have one case outside as it will be the most common case
  let tempCode = Math.floor(100000 + Math.random() * 900000);
  const data = await Template.findOne({
    where: {
      templateCode: tempCode
    }
  }, { transaction });
  // data is not null, try again with another tempCode
  while (data !== null) {
    console.log('Collision! Trying a new value');
    tempCode = Math.floor(100000 + Math.random() * 900000);
    data = await Template.findOne({
      where: {
        templateCode: tempCode
      }
    }, { transaction });
  }
  return tempCode;
}


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
  // for each request have a transaction sequilize object to roll back if something goes wrong
  // necessary for nested links between tables
  let transaction;

  try {
    transaction = await db.sequelize.transaction();
    // create a unique 6 digit code
    const code = await checkExistAndReturnTemplateCode(transaction);
    // form a template object with required information
    const template = {
      name: req.body.name,
      videoPermission: req.body.requestVideo,
      audioPermission: req.body.requestAudio,
      cookiesPermission: req.body.requestCookies,
      flow: req.body.flow,
      qualtricsId: req.body.qualtricsId,
      adminId: req.adminId,
      templateCode: code
    };

    const data = await Template.create(template, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send({
      _id: data._id
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while creating the Template."
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
      attributes: ['_id', 'name', 'templateCode']
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

const updateTemplate = async (req, res, next) => {
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }
  const { tempObj } = req.body;
  if (!tempObj) {
    res.status(400).send({
      message: "Template update data required!"
    });
    return;
  }

  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const data = await Template.update({
      templateCode: tempObj.templateCode
    }, {
      where: {
        _id: tempObj._id
      },
      transaction
    });
    await transaction.commit();

    res.send(data);
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while updating a template."
    });
  }
};

export default {
  create,
  getPrevTemplates,
  deletePrevTemplate,
  updateTemplate
}