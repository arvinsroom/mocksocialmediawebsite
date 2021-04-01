import db from "../clients/database-client";
const UserPostAction = db.UserPostAction;
const UserPostShare = db.UserPostShare;

const createAction = async (req, res, next) => {
  let transaction;

  try {
    const { actionObj } = req.body;
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    if (!actionObj) {
      res.status(400).send({
        message: "Action Object is required!"
      });
      return;
    }

    console.log ('actionObj: ', actionObj);
    // form a template object with required information
    const action = {
      userId: req.userId,
      platform: 'FACEBOOK',
      comment: actionObj.comment || null,
      action: actionObj.action,
      userPostId: actionObj.userPostId || null,
      adminPostId: actionObj.adminPostId || null,
    };
    transaction = await db.sequelize.transaction();
    const data = await UserPostAction.create(action, { transaction });
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
        error.message || "Some error occurred while creating the Action."
    });
  }
};

const deleteAction = async (req, res, next) => {
  let transaction;

  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    // fetch action _id from params
    const _id = req.params._id;
    if (!_id) {
      res.status(400).send({
        message: "Invalid Action Id!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();
    const data = await UserPostAction.destroy({
      where: {
        _id,
        userId: req.userId
      },
      transaction
    });
    await transaction.commit();

    res.send("Action was successfully deleted.");
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while deleting given Action."
    });
  }
};


const createSharePost = async (req, res, next) => {
  let transaction;

  try {
    const { shareObj } = req.body;
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    if (!shareObj) {
      res.status(400).send({
        message: "Share Object is required!"
      });
      return;
    }

    // form a template object with required information
    const share = {
      userId: req.userId,
      parentUserPostId: shareObj.parentUserPostId || null,
      parentAdminPostId: shareObj.parentAdminPostId || null,
      shareText: shareObj.shareText || null
    };
    transaction = await db.sequelize.transaction();
    const data = await UserPostShare.create(share, { transaction });
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
        error.message || "Some error occurred while creating the Share post."
    });
  }
};

export default {
  createAction,
  deleteAction,
  createSharePost
};
