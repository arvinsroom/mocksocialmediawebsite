import db from "../clients/database-client";
import { checkIfValidAndNotEmptyArray, checkIfValidAndNotEmptyObj } from '../utils';

const UserAnswer = db.UserAnswer;

const createMCQ = async (req, res, next) => {
  // create the page first
  let transaction;
  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    const { mcq } = req.body;
    if (!checkIfValidAndNotEmptyArray(mcq)) {
      res.status(400).send({
        message: "MCQ data is required!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();
    const promises = [];
    for (let i = 0; i < mcq.length; i++) {
      // mcq[i] only contains key as questionId and value as mcqOptionid
      for (const [key, value] of Object.entries(mcq[i])) {
        if (value) {
          promises.push({
            userId: req.userId,
            questionId: key,
            mcqOptionId: value,
          });
        }
      }
    }
    await UserAnswer.bulkCreate(promises, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    res.send({
      message: "Answers Created!"
    });
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
  // create the page first
  let transaction;
  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    const { opentext } = req.body;
    if (!checkIfValidAndNotEmptyObj(opentext)) {
      res.status(400).send({
        message: "Opentext data is required!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();
    let promises = [];
    for (const [key, value] of Object.entries(opentext)) {
      if (value) {
        promises.push({
          userId: req.userId,
          questionId: key,
          opentextAnswerText: value
        });
      }
    }

    await UserAnswer.bulkCreate(promises, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    res.send({
      message: "Answers created!"
    });
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