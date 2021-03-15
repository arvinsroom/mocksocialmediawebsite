import db from "../../clients/database-client";
const Question = db.Question;
const McqOption = db.McqOption;

// here we will recieve array of mcq options
const mcqBulkCreate = (mcqOptions, questionId) => {
  if (!questionId) throw "Question Id is required!"
  // recieve a question array
  if (mcqOptions.length < 1) {
    throw "Atleast one option is required for MCQ questions!"
  }
  // formulate the mcq options object
  for(let i = 0; i < mcqOptions.length; i++) {
    if (!mcqOptions[i].optionText) throw "Option Text is required!"
    mcqOptions[i].questionId = questionId;
  }
  
  McqOption.bulkCreate(mcqOptions)
    .then(data => {
      // return the whole data object
      console.log('MCQ OPTIONS BULK: ', data);
      return data;
    })
    .catch(err => {
      throw err.message || "Some error occurred while creating the Mcq options record(s)."
    });
};

// default required to true
const questionCreate = (questionText, required, pageId) => {
  if (!questionText) throw "Question Text is required!";
  const question = {
    pageId,
    required : required ? required : true,
    questionText
  }
  Question.create(question)
    .then(data => {
      return data._id
    })
    .catch(err => {
      throw err.message || "Some error occurred while creating a Question record.";
    });
};

// here we will recieve array of questions with, required and page Id
const bulkCreate = (questions, type, pageId) => {
  if (!type) throw "Type is required!";
  if (!pageId) throw "Page Id id is required!";

  // recieve a question array
  if (questions.length < 1) {
    throw 'Please provide atleast one question!';
  }
  let result = [];
  for(let i = 0; i < questions.length; i++) {
    // then create a single option
    const questionId = await questionCreate(questions[i].questionText, questions[i].required, pageId)
    result.push(questionId);
    if (type === 'MCQ') {
      await mcqBulkCreate(questions[i].mcqOptions, questionId);
    }
  }
  return result;
};


export default {
  bulkCreate,
}