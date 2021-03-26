import db from "../clients/database-client";
import Page from './create-page';
const Finish = db.Finish;

// save a finish page recod and return the _id for the finish page created
const create = async (req, res, next) => {
  const {
    templateId,
    name,
    type,
    finish
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
  if (!finish) {
    res.status(400).send({
      message: "Finish Data is required!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const pageId = await Page.pageCreate({ templateId, name, type }, transaction); // should return page Id
    // now create a entry for register
    const data = await Finish.create({
      templateId,
      pageId,
      text: finish.text ? finish.text : null,
      redirectionLink: finish.redirectionLink ? finish.redirectionLink : null
    }, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // send json for info _id
    res.send({
      _id: data._id
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Finish record."
    });
  }
};

const getFinishDetails = async (req, res, next) => {
  try {
    // fetch template _id from params
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }

    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }


    const data = await Finish.findOne({
      where: {
        pageId: pageId
      },
      attributes: ['text', 'redirectionLink']
    });

    res.send({
      data: data,
      userResponse: req.userId
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message:
        error.message || "Some error occurred while Fetching the Finish details."
    });
  }
};

export default {
  create,
  getFinishDetails,
}