import db from "../clients/database-client";
import Page from './create-page';
const Info = db.Info;

// save a Info and return the _id for the Info created
const create = async (req, res, next) => {
  const {
    templateId,
    name,
    type,
    info,
    consent
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
  if (!info.richText) {
    res.status(400).send({
      message: "Info Rich Data is required!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const pageId = await Page.pageCreate({ templateId, name, type }, transaction); // should return page Id
    // now create a entry for register
    const data = await Info.create({
      templateId,
      pageId,
      richText: info.richText,
      consent,
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
        error.message || "Some error occurred while creating the Info record."
    });
  }
};

const getInfoDetails = async (req, res, next) => {
  try {
    // fetch template _id from params
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }

    const data = await Info.findOne({
      where: {
        pageId: pageId
      },
      attributes: ['richText', 'consent']
    });

    res.send({
      data: data,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message:
        error.message || "Some error occurred while Fetching the Info page details."
    });
  }
};


export default {
  create,
  getInfoDetails
}