import db from "../clients/database-client";
import { checkIfValidAndNotEmptyArray } from "../utils";
import fb from './facebook-controller'
import page from './create-page';
const Media = db.Media;
const UserPost = db.UserPost;
const UserPostAuthor = db.UserPostAuthor;

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
    const { templateId, type, name, mediaPosts, pageDataOrder, author } = req.body;
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
    if (!checkIfValidAndNotEmptyArray(author)) {
      res.status(400).send({
        message: "Author object is required!"
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
    // bulk create the authors
    const authorKeys = ['authorId', 'authorName', 'authorVerified', 'totalPosts', 'totalFollowing', 'totalFollower', 'handle'];
    const authorArr = [];
    for (let i = 1; i < author.length; i++) {
      if (author[i].length > 0) {
        let obj = {};
        for (let j = 0; j < author[i].length; j++) {
          obj[authorKeys[j]] = author[i][j];
        }
        obj.pageId = pageId;
        authorArr.push(obj);
      }
    }
    console.log('Trying to create User Authors from excel file!')
    // create the Post records
    await UserPostAuthor.bulkCreate(authorArr, { transaction, logging: false });

    // modify the media array
    const mediaKeys = ['adminPostId', 'link', 'linkTitle', 'linkPreview', 'postMessage', 'sourceTweet', 'type', 'isFake', 'authorId', 'isReplyTo', 'isReplyToOrder', 'quoteTweetTo', 'initLike', 'initReply', 'initTweet', 'datePosted', 'likedBy', 'likedByOverflow', 'retweetedBy', 'retweetedByOverflow'];
    const mediaArr = [];
    //we will check if a post is a reply, if so we store in the mediaArrReplies
    const mediaArrReplies = [];
    for (let i = 1; i < mediaPosts.length; i++) {
      if (mediaPosts[i].length > 0) {
        let obj = {};
        for (let j = 0; j < mediaPosts[i].length; j++) {
          if (mediaKeys[j] === 'initTweet' || mediaKeys[j] === 'initReply') {
            obj[mediaKeys[j]] = mediaPosts[i][j] ? mediaPosts[i][j] : 0;
          } else {
            obj[mediaKeys[j]] = mediaPosts[i][j];
          }
        }
        obj.pageId = pageId;
        // seperate parent post from replyTo and quoteTweet posts
        if (obj.isReplyTo) {
          // have something in isReplyTo or something in quoteTweet
          mediaArrReplies.push(obj);
        } else{
          mediaArr.push(obj);
        }
      }
    }

    console.log('Trying to create User Posts from excel file!')
    // create the Post records
    await UserPost.bulkCreate(mediaArr, { transaction, logging: false });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    /*
      1) Try to push all the parent posts i.e. where isReplyTo === null.
      2) Update authors data from previous created authors (fetch using pageId) to match current 
          current authors from post spreadsheet
      3) Update isReplyTo ID and parentPostID to actuall UUID from parent post.
      4) Update quoteTweetTo ID to actuall UUID from parent post. (NOT parentPost ID)
    */
    transaction = await db.sequelize.transaction();
    //Now we will change the replyTo id for submited initial twitters to the auto. generated authorId,
    //fetch all author and store the ones from this page in authorsData
    let replyPosts = await UserPost.findAll({
      where: {
        pageId
      },
      attributes: ['_id', 'adminPostId']
    }, { transaction });
  
    let replyPostData = {};
    // const authorPostData = {};
    replyPosts.forEach(replyPost => {
      replyPostData[replyPost.adminPostId] = replyPost._id
    });

    //We will store in result the replyId and the author that made the reply.
    //result is an object, the key is the reply id, and the value is the authorID.
    //mediaArrReplies comes from the previous req.body, is the one hat contains the replayTo posts
    //and we did not store in db yet
    let result = [];
    for (let i = 0; i < mediaArrReplies.length; i++){
      // this contains all the previous parent posts created
      /*
        1) If any parentpost Id matched both isReplyTo and quoteTweetTo to a new to create post <-- should not happen
        2) if a parent post adminPostId matches some isReplyTo then we can update the isReplyTo
      */
      // if ((mediaArrReplies[i].isReplyTo && mediaArrReplies[i].isReplyTo in mediaArrReplies) || 
      //     (mediaArrReplies[i].quoteTweetTo && mediaArrReplies[i].quoteTweetTo in mediaArrReplies)) {
      //     const obj = {
      //       ...mediaArrReplies[i],
      //       parentPostId: replyPostData[mediaArrReplies[i].isReplyTo] ? replyPostData[mediaArrReplies[i].isReplyTo] : null,
      //       isReplyTo: replyPostData[mediaArrReplies[i].isReplyTo] ? replyPostData[mediaArrReplies[i].isReplyTo] : null,
      //       quoteTweetTo: replyPostData[mediaArrReplies[i].quoteTweetTo] ? replyPostData[mediaArrReplies[i].quoteTweetTo] : null
      //     }
      //     result.push(obj);
      // }
      if (mediaArrReplies[i].isReplyTo && mediaArrReplies[i].isReplyTo in mediaArrReplies) {
        result.push({
          ...mediaArrReplies[i],
          parentPostId: replyPostData[mediaArrReplies[i].isReplyTo] ? replyPostData[mediaArrReplies[i].isReplyTo] : null,
          isReplyTo: replyPostData[mediaArrReplies[i].isReplyTo] ? replyPostData[mediaArrReplies[i].isReplyTo] : null,
        });
      }
    }
    await UserPost.bulkCreate(result, { transaction, logging: false });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    transaction = await db.sequelize.transaction();
    // for quoteTweet
    replyPosts = await UserPost.findAll({
      where: {
        pageId
      },
      attributes: ['_id', 'adminPostId']
    }, { transaction });
    const quoteTweetPosts = await UserPost.findAll({
      where: {
        [db.Sequelize.Op.and]: [
          {
            pageId: pageId
          },
          {
            quoteTweetTo: {
              [db.Sequelize.Op.ne]: null
            }
          }
        ]
      },
      attributes: ['_id', 'adminPostId', 'quoteTweetTo', 'pageId']
    }, { transaction });
  
    replyPostData = {};
    // const authorPostData = {};
    replyPosts.forEach(replyPost => {
      replyPostData[replyPost.adminPostId] = replyPost._id
    });

    result = [];
    quoteTweetPosts.forEach(quotedPost => {
      if (quotedPost.quoteTweetTo === quotedPost.adminPostId || !(quotedPost.quoteTweetTo in replyPostData)) {
        result.push({
          _id: quotedPost._id,
          pageId: quotedPost.pageId,
          quoteTweetTo: null
        });
      }
      else if (quotedPost.quoteTweetTo in replyPostData) {
        result.push({
          _id: quotedPost._id,
          pageId: quotedPost.pageId,
          quoteTweetTo: replyPostData[quotedPost.quoteTweetTo]
        });
      }
    });

    await UserPost.bulkCreate(result, {
      updateOnDuplicate: ["quoteTweetTo", "pageId"], 
      transaction,
      logging: false
    });
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
    console.log(`Trying to create Media entries for ${postData}.`)
    // updateOnDuplicate: ['userPostId'],
    // this won't work yet as we do not have a logic to make userPostId unique
    // find another way
    await Media.bulkCreate(mediaArr, {
      transaction,
      logging: false
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

const uploadMultipleAuthourFiles = async (req, res, next) => {
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
      attributes: ['_id', 'authorId']
    }, { transaction });

    //check if posts has an authorId and save them in authorData
    const authorData = {};
    posts.forEach((post) => {
      authorData[post.authorId] = post.authorId;
    });
    const mediaArr = [];
    for (let i = 0; i < files.length; i++) {
      // fetch the id from file name
      const authorId = files[i].originalname.split(".")[0];
      // should only create entry if author id exist
      if (authorData[authorId]) {
        // should only create entry if authorId id exist
        mediaArr.push({
          mimeType: files[i].mimetype,
          media: files[i].buffer,
          authorId: authorData[authorId],
        });
      }
    }
    console.log(`Trying to create Media entries for Authors ${authorData}.`)
    // updateOnDuplicate: ['userPostId'],
    // this won't work yet as we do not have a logic to make userPostId unique
    // find another way
    await Media.bulkCreate(mediaArr, {
      transaction,
      logging: false
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
      message: "Some error occurred while storing multi Author media."
    });
  }
};

export default {
  create,
  uploadMultipleFiles,
  uploadMultipleAuthourFiles
}
