import db from "../clients/database-client";
const User = db.User;

const update = async (req, res, next) => {
  let transaction;
  try {

    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const { userObj } = req.body;
    if (!userObj) {
      res.status(400).send({
        message: "User data is required!"
      });
      return;
    }

    // create the page first
    transaction = await db.sequelize.transaction();

    const userData = {};
    // create update object
    if (userObj.consent) userData['consent'] = userObj.consent;
    if (userObj.finishedAt) userData['finishedAt'] = userObj.finishedAt;
    if (userData.qualtricsId) userData['qualtricsId'] = userData.qualtricsId;

    // now create a entry for register
    await User.update(userData,
      {
        where: {
          _id: req.userId
        },
        transaction
      });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send("Success!");
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while updating user's information."
    });
  }
};

export default {
  update,
}