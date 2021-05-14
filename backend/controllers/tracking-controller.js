import db from "../clients/database-client";
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
    if (!trackObj) {
      res.status(400).send({
        message: "Tracking data is required!"
      });
      return;
    }
    if (!trackObj.action) {
      res.status(400).send({
        message: "Tracking Action is required!"
      });
      return;
    }
    // create the page first
    transaction = await db.sequelize.transaction();
    const tracking = {
      userId: req.userId,
      userPostId: trackObj.userPostId || null,
      action: trackObj.action,
    };
    await UserPostTracking.create(tracking, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send({
      message: "Success"
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