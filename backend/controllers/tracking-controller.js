import db from "../clients/database-client";
import { checkIfValidAndNotEmptyObj } from "../utils";
const UserPostTracking = db.UserPostTracking;

const create = async (req, res, next) => {
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

export default {
  create,
}