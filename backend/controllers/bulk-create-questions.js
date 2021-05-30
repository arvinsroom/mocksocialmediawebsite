import db from "../clients/database-client";
import { checkIfValidAndNotEmptyArray } from "../utils";
const Question = db.Question;
const McqOption = db.McqOption;

// here we will recieve array of mcq options
const mcqBulkCreate = async (options, questionId, transaction) => {
  if (!questionId) throw "Question Id is required!";
  // recieve a question array
  if (options?.length < 1) {
    throw "Atleast one option is required for MCQ questions!";
  }
  // formulate the mcq options object
  const mcqOptions = [];
  for(let i = 0; i < options.length; i++) {
    const tempObj = {};
    if (!options[i].optionText) throw "Option text is requiret!";
    tempObj.questionId = questionId;
    tempObj.optionText = options[i].optionText;
    tempObj.optionOrder = options[i].optionOrder || 0;
    mcqOptions.push(tempObj);
  }
  
  try {
    return await McqOption.bulkCreate(mcqOptions, { transaction });
  } catch (error) {
    console.log(error.message);
    throw "Some error occurred while creating the Mcq options record(s).";
  }
};

// here we will recieve array of questions with, required and page Id, order, multiResponse,
const bulkCreate = async (questions, type, pageId, transaction) => {
  if (!type) throw "Type is required!";
  if (!pageId) throw "Page Id id is required!";

  // recieve a question array
  if (!checkIfValidAndNotEmptyArray(questions)) {
    throw 'Please provide a valid question.';
  }

  for(let i = 0; i < questions.length; i++) {
    if (!questions[i].questionText) throw "Question Text field is required!";
    // then create a single option
    const questionObj = {
      questionText: questions[i].questionText,
      required: questions[i].required || false,
      order: questions[i].order || 0,
      multiResponse: questions[i].multiResponse || false,
      pageId
    };

    const { _id: questionId } = await Question.create(questionObj, { transaction });

    if (type === 'MCQ') {
      await mcqBulkCreate(questions[i].mcqOptions, questionId, transaction);
    }
  }
};

export default {
  bulkCreate,
}