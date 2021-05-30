import db from "../clients/database-client";
import { checkIfValidAndNotEmptyObj } from "../utils";
const UserPostAction = db.UserPostAction;
const UserPost = db.UserPost;
const Media = db.Media;
const UserGlobalTracking = db.UserGlobalTracking;
const Language = db.Language;

const createAction = async (req, res, next) => {
  let transaction;

  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    const { actionObj } = req.body;
    if (!checkIfValidAndNotEmptyObj(actionObj)) {
      res.status(400).send({
        message: "Action data is required!"
      });
      return;
    }
    // form a template object with required information
    const action = {
      userId: req.userId,
      comment: actionObj.comment || null,
      action: actionObj.action,
      userPostId: actionObj.userPostId || null,
    };
    transaction = await db.sequelize.transaction();
    const data = await UserPostAction.create(action, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    res.send({
      _id: data._id
    });
  } catch (error) {
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Action."
    });
  }
};

const deleteAction = async (req, res, next) => {
  let transaction;
  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    // fetch action _id from params
    const _id = req.params._id;
    if (!_id) {
      res.status(400).send({
        message: "Invalid Action Id!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();
    await UserPostAction.destroy({
      where: {
        _id,
        userId: req.userId
      },
      transaction
    });
    await transaction.commit();

    res.send("Action was successfully deleted.");
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Error occurred when deleting Action."
    });
  }
};

const createNewPost = async (req, res, next) => {
  let transaction;
  try {
    const postObj = JSON.parse(req.body.postObj);
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    if (!postObj && !req.file) {
      res.status(400).send({
        message: "Please create a valid post!"
      });
      return;
    }
    const { postMessage, parentPostId, pageId, type } = postObj;
    if (!pageId) {
      res.status(400).send({
        message: "Please provide a valid pageId!"
      });
      return;
    }
    if (!type) {
      res.status(400).send({
        message: "Please provide a valid post type!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();
    // create post
    let post = {
      userId: req.userId,
      postMessage: postMessage || "",
      pageId: pageId,
      type,
      parentPostId: parentPostId || null
    };
    const data = await UserPost.create(post, { transaction });

    let mediaData = null;
    let attachedMedia = [];
    if (req.file) {
      // put details for the media in Media table
      const media = {
        userPostId: data._id,
        media: req.file.buffer,
        mimeType: req.file.mimetype,
      };
      mediaData = await Media.create(media, { transaction });
      attachedMedia.push(mediaData);
    }

    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    res.send({
      _id: data._id, // new post id
      attachedMedia,
      post: {
        type: data.type,
        postMessage: data.postMessage,
        parentPostId: data.parentPostId,
      }
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while creating the New User post."
    });
  }
};

const getFacebookPostIds = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const { templateId, platform, language, pageId, order } = req.params;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }
    let data = null;
    const whereClause = {
      [db.Sequelize.Op.and]: [
        { pageId: pageId },
        { userId: null }
      ]
    };

    transaction = await db.sequelize.transaction();
    if (order === 'RANDOM') {
      data = await UserPost.findAndCountAll({
        where: whereClause,
        order: db.sequelize.literal('rand()'),
        attributes: ['adminPostId', '_id']
      }, { transaction });
    } else if (order === 'DESC') {
      data = await UserPost.findAndCountAll({
        where: whereClause,
        order: [
          ['adminPostId', 'DESC']
        ],
        attributes: ['adminPostId', '_id']
      }, { transaction });
    } else {
      // keep default as ASC or any other fallback
      data = await UserPost.findAndCountAll({
        where: whereClause,
        order: [
          ['adminPostId', 'ASC']
        ],
        attributes: ['adminPostId', '_id']
      }, { transaction });
    }
    const postIds = [];
    if (data.count > 0) {
      // fetch the old object, if it exist for that user
      const prevGlobalTrackingObj = await UserGlobalTracking.findOne({
        where: {
          userId: req.userId,
          pageId
        }
      }, { transaction });

      let parsedMetaData = {};
      if (prevGlobalTrackingObj?.pageMetaData) {
        // parse the metaData
        parsedMetaData = JSON.parse(prevGlobalTrackingObj.pageMetaData);
      }
      parsedMetaData['facebookPostsOrderAdminIds'] = [];
      // fetch the renderering order and store that in database, for post tracking
      data.rows.forEach(row => {
        parsedMetaData['facebookPostsOrderAdminIds'].push(row.adminPostId);
        postIds.push(row._id);
      });

      // stringify again the metadata object and upsert it
      const stringify = JSON.stringify(parsedMetaData);
      console.log('Adding to User Global Tracking MetaData: ', stringify);
      await UserGlobalTracking.upsert({
        userId: req.userId,
        pageMetaData: stringify,
        pageId
      }, { transaction });
    }

    // fetch the language data for current page
    const translations = await Language.findOne({
      where: {
        templateId: templateId,
        name: language,
        platform: platform,
      },
      attributes: ['name', 'translations']
    }, { transaction });

    await transaction.commit();

    res.send({
      totalPosts: data.count,
      postIds: postIds,
      translations
    });
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while Fetching default media post(s)."
    });
  }
};

const getFacebookPostWithDetails = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const { postIds } = req.body;
    if (!postIds) {
      res.status(400).send({
        message: "Invalid fetch Posts Object!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();
    const data = await UserPost.findAll({
      where: {
        _id: postIds,
      },
      // attributes: ,
      order: db.sequelize.literal("FIND_IN_SET(UserPost._id,'"+postIds.join(',')+"')"),
      include: [
        {
          model: Media,
          as: 'attachedMedia',
        }
      ]
    }, { transaction });

    await transaction.commit();
    res.send({
      postDetails: data,
    });

  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while Fetching default media post(s)."
    });
  }
};

const getFacebookFakeActionPosts = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }

    // sharePostsData: [
    //   {
      //   _id: "bcb71dd5-53a6-4459-972d-4b71f5227c30",
      //   adminPostId: null,
      //   type: "VIDEO",
      //   linkTitle: null,
      //   link: null,
      //   linkPreview: null,
      //   postMessage: "video post",
      //   isFake: false,
      //   sourceTweet: null,
      //   userId: "894b9794-ddf8-4eb1-aaa4-628f0b949cea",
      //   pageId: "241b0ea2-fe4f-4cf8-bc71-bb4bc457ca1f",
      //   createdAt: "2021-04-25T20:32:34.076Z"
      //   parentPostId: {
      //      isFake: true,
      // }
      //   },
    //   {
    transaction = await db.sequelize.transaction();
    const shareData = await UserPost.findAll({
      where: {
        userId: req.userId,
      },
      attributes: ['postMessage', 'type', '_id', 'createdAt'],
      include: [
        {
          where: {
            isFake: true,
            pageId: pageId
          },
          model: UserPost,
          as: 'parentUserPost',
          attributes: ['_id', 'type', 'postMessage', 'isFake', 'adminPostId'],
        }
      ]
    }, { transaction });

    // actionPostsData: [
    //   {
    //     _id: "412363a7-613e-40bd-9365-854c5c347624",
    //     userId: "894b9794-ddf8-4eb1-aaa4-628f0b949cea",
    //     userPostId: "6033e1dc-5f64-4134-b4a1-10a382c9958e",
    //     action: "LIKE",
    //     comment: null,
    //     createdAt: "2021-04-25T20:34:54.427Z",
    //     userPosts: {
    //       _id: "6033e1dc-5f64-4134-b4a1-10a382c9958e",
    //       adminPostId: null,
    //       type: "SHARE",
    //       linkTitle: null,
    //       link: null,
    //       linkPreview: null,
    //       postMessage: "Sharing a post",
    //       isFake: true,
    //       sourceTweet: null,
    //       userId: "894b9794-ddf8-4eb1-aaa4-628f0b949cea",
    //       parentPostId: "c01482d9-08a6-4e59-8168-0c21763b7711",
    //       pageId: "241b0ea2-fe4f-4cf8-bc71-bb4bc457ca1f",
    //       createdAt: "2021-04-25T20:33:41.907Z"
    //       }
    //     },
    const actionData = await UserPostAction.findAll({
      where: {
        userId: req.userId
      },
      attributes: ['_id', 'action', 'comment', 'createdAt'],
      include: [
        {
          where: {
            isFake: true,
            pageId: pageId
          },
          model: UserPost,
          as: 'userPosts',
          attributes: ['_id', 'type', 'postMessage', 'isFake', 'adminPostId'],
        }
      ]
    }, { transaction });

    await transaction.commit();
    res.send({
      sharePostsData: shareData,
      actionPostsData: actionData,
    });

  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while Fetching (s)."
    });
  }
};


export default {
  createAction,
  deleteAction,
  createNewPost,
  getFacebookPostIds,
  getFacebookPostWithDetails,
  getFacebookFakeActionPosts
};
