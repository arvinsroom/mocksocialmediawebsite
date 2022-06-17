import db from "../clients/database-client";
import { checkIfValidAndNotEmptyObj } from "../utils";
const UserPostTracking = db.UserPostTracking;
const UserGlobalTracking = db.UserGlobalTracking;

const createOrUpdatePostTrackingData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const { trackObj } = req.body;
    if (!checkIfValidAndNotEmptyObj(trackObj)) {
      res.status(400).send({
        message: "Tracking data is required!"
      });
      return;
    }
    if (!trackObj.action || !trackObj.userPostId) {
      res.status(400).send({
        message: "Tracking action or post data is required!"
      });
      return;
    }
    // create the page first
    transaction = await db.sequelize.transaction();
    await UserPostTracking.create({
      userId: req.userId,
      userPostId: trackObj.userPostId,
      action: trackObj.action,
    }, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    
    // console.log(`User with ID ${req.userId} performed ${trackObj.action} action on post with ID ${userPostId}`);

    res.send({
      message: "Tracking data saved!"
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while tracking user information."
    });
  }
};

const createOrUpdateGlobalPageMetaData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const { finishedAt, pageId } = req.body;
    if (!finishedAt || !pageId) {
      res.status(200).send({
        message: "Nothing to update or Invalid Page Id!"
      });
      return;
    }
    
    transaction = await db.sequelize.transaction();
    // fetch the old object, if it exist for that user
    const prevGlobalTrackingObj = await UserGlobalTracking.findOne({
      where: {
        userId: req.userId,
        pageId
      }
    }, { transaction });

    let parsedMetaData = {};
    if (prevGlobalTrackingObj?.pageMetaData) {
      // parse the metaData
      parsedMetaData = JSON.parse(prevGlobalTrackingObj.pageMetaData);
    }
    // add start or finish time from incoming request
    // if (startedAt) parsedMetaData['startedAt'] = startedAt;
    if (finishedAt) parsedMetaData['finishedAt'] = finishedAt;

    // stringify again the metadata object and upsert it
    const stringify = JSON.stringify(parsedMetaData);
    console.log('Adding to User Global Tracking MetaData: ', stringify);

    let upsertObj = {};
    if (prevGlobalTrackingObj?._id) upsertObj._id = prevGlobalTrackingObj._id;
    upsertObj.userId = req.userId;
    upsertObj.pageMetaData = stringify;
    upsertObj.pageId = pageId;

    await UserGlobalTracking.upsert(upsertObj, { transaction, logging: false });
    await transaction.commit();

    res.send("Page Metadata updated!");
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while updating page meta data."
    });
  }
};


export default {
  createOrUpdatePostTrackingData,
  createOrUpdateGlobalPageMetaData
}