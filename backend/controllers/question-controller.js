import page from './create-page';
import bulkQuestions from './bulk-create-questions';
import db from "../clients/database-client";
const Question = db.Question;
const McqOption = db.McqOption;

const create = async (req, res, next) => {
  const { templateId, type, pageName, pageQuestionArr } = req.body;
  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!type) {
    res.status(400).send({
      message: "Page type is required!"
    });
    return;
  }
  if (!pageName) {
    res.status(400).send({
      message: "Page Name is required!"
    });
    return;
  }
  if (!pageQuestionArr && Array.isArray(pageQuestionArr)) {
    res.status(400).send({
      message: "Question data is required!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    // create the page with the name and template Id
    const pageId = await page.pageCreate({
      name: pageName,
      templateId,
      type
    }, transaction);
    // add page Id
    // now create the full page with all the questions
    await bulkQuestions.bulkCreate(pageQuestionArr, type, pageId, transaction);

    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    // add response for _id of all questions with specific page id's
    res.status(200).send({
      message: "Questions Created."
    });

  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Question record."
    });
  }
};

const fetchQ = async (pageId) => {
  try {
    const allQuestions = await Question.findAll({
      where: {
        pageId
      },
      include: [
        {
          model: McqOption,
          as: 'mcqOption',
          attribute: ['optionText', '_id']
        }
      ]
    })
    return allQuestions;
  } catch (error) {
    throw error;
  }
}

// user route
const fetchAllQuestions = async (req, res, next) => {
  // fetch template _id from params
  const pageId = req.params.pageId;
  const type = req.params.type;

  if (!pageId) {
    res.status(400).send({
      message: "Invalid Page Id!"
    });
    return;
  }
  if (!type) {
    res.status(400).send({
      message: "Invalid Page Type!"
    });
    return;
  }

  // for open text,
  // 1) fetch question object using page Id from question table
  // let transaction;
  try {
    // transaction = await db.sequelize.transaction();
    const result = await fetchQ(pageId);
    // await transaction.commit();
    res.send({
      result
    });
  } catch (error) {
    console.log(error.message);
    // if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching questions."
    });
  }
};


export default {
  create,
  fetchAllQuestions,
}