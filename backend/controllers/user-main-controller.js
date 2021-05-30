import db from "../clients/database-client";
import { checkIfValidAndNotEmptyObj } from "../utils";
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
    if (!checkIfValidAndNotEmptyObj(userObj)) {
      res.status(400).send({
        message: "User data is required!"
      });
      return;
    }

    // add more validation to compare incoming data and its types
    const userData = {};
    for (const [key, value] of Object.entries(userObj)) {
      userData[key] = value;
    }

    transaction = await db.sequelize.transaction();
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

    res.send({
      response: "User successfuly updated!"
    });
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