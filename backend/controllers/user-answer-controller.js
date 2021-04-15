import db from "../clients/database-client";
const UserAnswer = db.UserAnswer;

const createMCQ = async (req, res, next) => {
  const { mcq } = req.body;
  if (!mcq) {
    res.status(400).send({
      message: "MCQ object is required!"
    });
    return;
  }

  // fetch userId from middleware
  if (!req.userId) {
    res.status(400).send({
      message: "Invalid User Token, please log in again!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let promises = [];
    for (const [key, value] of Object.entries(mcq)) {
      if (value) {
        promises.push(UserAnswer.create({
          userId: req.userId,
          questionId: key,
          mcqOptionId: value,
        }, { transaction }));
      }
    }
    const result = await Promise.all(promises);
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the MCQ Answer record."
    });
  }
};

const createOpentext = async (req, res, next) => {
  const { opentext } = req.body;
  if (!opentext) {
    res.status(400).send({
      message: "Opentext object is required!"
    });
    return;
  }

  // fetch userId from middleware
  if (!req.userId) {
    res.status(400).send({
      message: "Invalid User Token, please log in again!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let promises = [];
    for (const [key, value] of Object.entries(opentext)) {
      if (value) {
        promises.push(UserAnswer.create({
          userId: req.userId,
          questionId: key,
          opentextAnswerText: value
        }, { transaction }));
      }
    }
    const result = await Promise.all(promises);
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the OpenText Answer record."
    });
  }
};


export default {
  createMCQ,
  createOpentext
}