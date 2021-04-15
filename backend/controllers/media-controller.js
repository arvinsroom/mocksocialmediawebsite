import page from './create-page';
import db from "../clients/database-client";
const AdminPost = db.AdminPost;

const create = async (req, res, next) => {
  const { templateId, type, name, mediaPosts, pageDataOrder } = req.body;
  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!name) { // media
    res.status(400).send({
      message: "Page Name is required!"
    });
    return;
  }
  if (!type) { // FACEBOOK, TWITTER, etc
    res.status(400).send({
      message: "Page type is required!"
    });
    return;
  }
  if (!mediaPosts && Array.isArray(mediaPosts) && mediaPosts.length > 0) {
    res.status(400).send({
      message: "Media post object is required!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    // create the page with the name within each pageQuestionArray and template Id
    const pageId = await page.pageCreate({
      name: name,
      templateId,
      type,
      pageDataOrder: pageDataOrder || null
    }, transaction);

    // modify the media array
    const mediaKeys = ['_id', 'link', 'linkTitle', 'linkPreview', 'postMessage', 'sourceTweet', 'type', 'isFake'];
    let mediaArr = [];
    for (let i = 1; i < mediaPosts.length; i++) {
      if (mediaPosts[i].length > 0) {
        let obj = {};
        for (let j = 0; j < mediaPosts[i].length; j++) {
          obj[mediaKeys[j]] = mediaPosts[i][j];
        }
        // add pageId and templateId
        obj.templateId = templateId;
        obj.pageId = pageId;
        mediaArr.push(obj);
      }
    }

    // create the Admin Post records
    const data = await AdminPost.bulkCreate(mediaArr, { transaction });
    // fetch all the ids created for post
    const ids = data.map(item => {
      return item._id;
    });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    // add response for _id of all questions with specific page id's
    res.send({
      ids
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while creating the Admin Post record. Make sure post ID(s) are not same!"
    });
  }
};


export default {
  create,
}