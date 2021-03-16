import page from './create-page';
import bulkQuestions from './bulk-create-questions';

// here we will recieve array of question
// 1) we need to create a page with specific id and type and tempplate id
// 2) use that information and create a question and its respective mcq options
const create = async (req, res) => {
  const { templateId, type, pageQuestionArr } = req.body; 
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
  if (!pageQuestionArr && Array.isArray(pageQuestionArr)) {
    res.status(400).send({
      message: "Page and question data array required!"
    });
    return;
  }
  
  const result = [];
  for (let i = 0; i < pageQuestionArr.length; i++) {
    // create the page with the name within each pageQuestionArray and template Id
    let retObj = {};
    const pageObj = {
      name: pageQuestionArr[i].name,
      templateId,
      type
    };
    const pageId = await page.pageCreate(pageObj);
    // add page Id
    retObj.pageId = pageId;
    // now create the full page with all the questions
    const questionIdArr = await bulkQuestions.bulkCreate(pageQuestionArr[i].questions, type, pageId);
    // add all the questions created array
    retObj.questions = questionIdArr;
    result.push(retObj);
  }
  // add response for _id of all questions with specific page id's
  res.res(result);
};


export default {
  create,
}