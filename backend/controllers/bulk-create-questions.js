import db from "../clients/database-client";
const Question = db.Question;
const McqOption = db.McqOption;

// here we will recieve array of mcq options
const mcqBulkCreate = async (mcqOptions, questionId, transaction) => {
  if (!questionId) throw "Question Id is required!";
  // recieve a question array
  if (mcqOptions && mcqOptions.length < 1) {
    throw "Atleast one option is required for MCQ questions!";
  }
  // formulate the mcq options object
  for(let i = 0; i < mcqOptions.length; i++) {
    if (!mcqOptions[i].optionText) throw "Option Text is required!";
    mcqOptions[i].questionId = questionId;
  }
  
  try {
    const data = await McqOption.bulkCreate(mcqOptions, { transaction });
    // return the whole data object
    console.log('MCQ OPTIONS BULK: ', data);
    // return data;
    return;
  } catch (error) {
    throw error.message || "Some error occurred while creating the Mcq options record(s).";
  }
};

// default required to true
const questionCreate = async (questionText, required, pageId, transaction) => {
  if (!questionText) throw "Question Text is required!";
  const question = {
    pageId,
    required : required ? required : true,
    questionText
  }
  try {
    const data = await Question.create(question, { transaction });
    return data._id;
  }
  catch(error) {
    console.log(error.message);
    throw error.message || "Some error occurred while creating a Question record.";
  }
};

// here we will recieve array of questions with, required and page Id
const bulkCreate = async (questions, type, pageId, transaction) => {
  if (!type) throw "Type is required!";
  if (!pageId) throw "Page Id id is required!";

  // recieve a question array
  if (questions && questions.length < 1 && Array.isArray(questions)) {
    throw 'Please provide atleast one question!';
  }

  let result = [];
  for(let i = 0; i < questions.length; i++) {
    // then create a single option
    const questionId = await questionCreate(questions[i].questionText, questions[i].required, pageId, transaction);
    result.push(questionId);
    console.log('questionId: ', questionId)
    if (type === 'MCQ') {
      await mcqBulkCreate(questions[i].mcqOptions, questionId, transaction);
    }
  }
  return result;
};


export default {
  bulkCreate,
}