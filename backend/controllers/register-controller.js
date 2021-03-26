import db from "../clients/database-client";
import Page from './create-page';
const Register = db.Register;

// save a Info and return the _id for the Info created
const create = async (req, res, next) => {
  const {
    templateId,
    name,
    type,
    register
  } = req.body;
  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!name) {
    res.status(400).send({
      message: "Page name is required!"
    });
    return;
  }
  if (!type) {
    res.status(400).send({
      message: "Page Type is required!"
    });
    return;
  }
  if (!register) {
    res.status(400).send({
      message: "Register Object is required!"
    });
    return;
  }

  // create  the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const pg = { templateId, name, type };
    const pageId = await Page.pageCreate(pg, transaction); // should return page Id
    // now create a entry for register
    const data = await Register.create({
      templateId: templateId,
      pageId,
      profilePic: register.profilePic ? register.profilePic : false,
      username: register.username ? register.username : false,
    }, { transaction });
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
      message:
        error.message || "Some error occurred while creating the Register record."
    });
  }
};

export default {
  create,
}