import db from "../clients/database-client";
import { checkIfValidAndNotEmptyArray } from "../utils";
import page from './create-page';
const Media = db.Media;
const UserPost = db.UserPost;

const create = async (req, res, next) => {
  // create the page first
  let transaction;
  try {
    // fetch the adminId added from middleware
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }
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
    if (!checkIfValidAndNotEmptyArray(mediaPosts)) {
      res.status(400).send({
        message: "Media post object is required!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();
    // create the page with the name within each pageQuestionArray and template Id
    const pageId = await page.pageCreate({
      name: name,
      templateId,
      type,
      pageDataOrder: pageDataOrder || null
    }, transaction);

    // modify the media array
    const mediaKeys = ['adminPostId', 'link', 'linkTitle', 'linkPreview', 'postMessage', 'sourceTweet', 'type', 'isFake'];
    const mediaArr = [];
    for (let i = 1; i < mediaPosts.length; i++) {
      if (mediaPosts[i].length > 0) {
        let obj = {};
        for (let j = 0; j < mediaPosts[i].length; j++) {
          obj[mediaKeys[j]] = mediaPosts[i][j];
        }
        obj.pageId = pageId;
        mediaArr.push(obj);
      }
    }

    // create the Post records
    await UserPost.bulkCreate(mediaArr, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    // return the pageId with the request
    res.send({
      response: "Success"
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while creating the Admin Post record. Make sure post ID(s) are not same!"
    });
  }
};

const uploadMultipleFiles = async (req, res, next) => {
  // create the page first
  let transaction;
  try {
    const { pageId } = req.body;
    const { files } = req;
    if (!files) {
      res.status(400).send({
        message: "You must provide a file!"
      });
      return;
    }
    if (!pageId) {
      res.status(400).send({
        message: "Page Id is required!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();

    // fetch all the posts for that specific social media page
    const posts = await UserPost.findAll({
      where: {
        pageId
      },
      attributes: ['_id', 'adminPostId']
    }, { transaction });

    const postData = {};
    posts.forEach(post => {
      postData[post.adminPostId] = post._id;
    });

    const mediaArr = [];
    for (let i = 0; i < files.length; i++) {
      // fetch the id from file name
      const postId = files[i].originalname.split(".")[0];
      // should only create entry if post id exist
      if (postData[postId]) {
        mediaArr.push({
          mimeType: files[i].mimetype,
          media: files[i].buffer,
          userPostId: postData[postId],
        });
      }
    }
    // updateOnDuplicate: ['userPostId'],
    // this won't work yet as we do not have a logic to make userPostId unique
    // find another way
    await Media.bulkCreate(mediaArr, {
      transaction,
    });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    // send json
    res.send({
      response: "Success"
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while storing multi post media."
    });
  }
};

export default {
  create,
  uploadMultipleFiles
}
