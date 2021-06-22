import db from "../clients/database-client";
import Page from './create-page';
const Info = db.Info;
const User = db.User;

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
      isFinish,
      responseCode
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
      isFinish: isFinish || false,
      showResponseCode: responseCode || false,
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

// will mostly run once
const checkExistAndReturnResponseCode = async (transaction) => {
  // have one case outside as it will be the most common case
  let responseCode = Math.floor(100000 + Math.random() * 900000);
  const data = await User.findOne({
    where: {
      responseCode
    }
  }, { transaction });
  // data is not null, try again with another tempCode
  while (data !== null) {
    console.log('Collision! Trying a new Response Code.');
    responseCode = Math.floor(100000 + Math.random() * 900000);
    data = await User.findOne({
      where: {
        responseCode
      }
    }, { transaction });
  }
  return responseCode;
}

const getInfoDetails = async (req, res, next) => {
  let transaction;
  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    // fetch template _id from params
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();

    console.log(`Fetching Information details for page ${pageId}.`);

    const data = await Info.findOne({
      where: {
        pageId: pageId
      },
      attributes: ['consent', 'socialMediaPageId', 'isFinish', 'showResponseCode']
    }, { transaction, logging: false });
    
    let code = null;
    // add the logic to generate the 6 digit code if showResponseCode is true
    if (data.showResponseCode) {
      // create a unique 6 digit response code
      code = await checkExistAndReturnResponseCode(transaction);
      // update the user object
      await User.update({
        responseCode: code
      }, {
        where: {
          _id: req.userId
        },
        transaction
      });
    }

    await transaction.commit();
    res.send({
      infoDetails: data,
      responseCode: code
    });

  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
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