import db from "../clients/database-client";
import Page from './create-page';
const Info = db.Info;

// save a Info and return the _id for the Info created
const create = async (req, res, next) => {
  let transaction;
  try {
    const {
      templateId,
      name,
      type,
      richText,
      consent,
      socialMediaPageId,
      isFinish
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

    transaction = await db.sequelize.transaction();
    const pageId = await Page.pageCreate({ templateId, name, type, richText }, transaction); // should return page Id
    // now create a entry for register
    await Info.create({
      templateId,
      pageId,
      consent: consent || false,
      socialMediaPageId: socialMediaPageId || null,
      isFinish: isFinish || false
    }, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // send json for info _id
    res.send({
      message: "Information page successfully created!"
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while creating the Info page."
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
      attributes: ['consent', 'socialMediaPageId', 'isFinish']
    });

    res.send({
      infoDetails: data,
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