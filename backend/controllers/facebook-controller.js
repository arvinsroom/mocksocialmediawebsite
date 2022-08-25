import db from "../clients/database-client";
import { checkIfValidAndNotEmptyObj, shuffle, getNumberOrZero } from "../utils";
const UserPostAction = db.UserPostAction;
const UserPost = db.UserPost;
const Media = db.Media;
const UserGlobalTracking = db.UserGlobalTracking;
const Language = db.Language;
const UserPostAuthor = db.UserPostAuthor;

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
    const data = await UserPostAction.create(action, { transaction, logging: false });
    console.log(`${action.action} performed by ${action.userId} on user post with ID ${action.userPostId}.`);
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
      transaction,
      logging: false
    });
    console.log(`Deleting action with ID ${_id} for user ${req.userId}.`)
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
    const { postMessage, parentPostId, pageId, type, isReplyTo, quoteTweetTo } = postObj;
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
      isReplyTo: isReplyTo || null,
      quoteTweetTo: quoteTweetTo || null,
      parentPostId: parentPostId || null
    };
    const data = await UserPost.create(post, { transaction, logging: false });
    console.log(`Creating post for user ${req.userId} of type ${type}.`);
    let mediaData = null;
    let attachedMedia = [];
    if (req.file) {
      // put details for the media in Media table
      const media = {
        userPostId: data._id,
        media: req.file.buffer,
        mimeType: req.file.mimetype,
      };
      mediaData = await Media.create(media, { transaction, logging: false });
      console.log(`Also ataching Media entry for user ${req.userId} with file type as: ${media.mimeType}`);
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
        isReplyTo: data.isReplyTo,
        quoteTweetTo: data.quoteTweetTo,
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
    // if (order === 'RANDOM') {
    //   data = await UserPost.findAndCountAll({
    //     where: whereClause,
    //     order: db.sequelize.literal('rand()'),
    //     attributes: ['adminPostId', '_id']
    //   }, { transaction });
    // } else if (order === 'DESC') {
    //   data = await UserPost.findAndCountAll({
    //     where: whereClause,
    //     order: [
    //       ['adminPostId', 'DESC']
    //     ],
    //     attributes: ['adminPostId', '_id']
    //   }, { transaction });
    // } else {
    //   // keep default as ASC or any other fallback
    //   data = await UserPost.findAndCountAll({
    //     where: whereClause,
    //     order: [
    //       ['adminPostId', 'ASC']
    //     ],
    //     attributes: ['adminPostId', '_id']
    //   }, { transaction });
    // }
    data = await UserPost.findAndCountAll({
      where: whereClause,
      attributes: ['adminPostId', '_id', 'isReplyTo', 'isReplyToOrder']
    }, { transaction });
    // need to create a temp object which will fetch all the posts with postId
    const adminPostIds = {};
    const adminPostUUIDs = {};
    // get only the main posts which have no replies
    data.rows.forEach(row => {
      if (row.isReplyTo === null) {
        adminPostIds[row.adminPostId] = {
          replies: [],
          _id: row._id
        }
        adminPostUUIDs[row._id] = row.adminPostId;
      }
    });

    // we iterate over all the array again
    // and try to associate the replies to there correct parent
    // if not present we want to skip
    data.rows.forEach(row => {
      // check if replyTo is not null
      if (row.isReplyTo !== null) {
        // check if assiciated key is present in adminPostIds object
        if (row.isReplyTo in adminPostUUIDs) {
          adminPostIds[adminPostUUIDs[row.isReplyTo]].replies.push({
            _id: row._id,
            order: getNumberOrZero(row.isReplyToOrder),
            adminPostId: row.adminPostId
          });
        }
      }
    });

    let adminPostIdsSorted = [];
    // sort the adminPostIds according to desired values i.e. input order
    if (order === 'RANDOM') {
      adminPostIdsSorted = shuffle(Object.keys(adminPostIds))
      .reduce((accumulator, key) => {
        accumulator.push({
          [key]: adminPostIds[key]
        });
        return accumulator;
      }, []);
    } else if (order === 'DESC') {
      adminPostIdsSorted = Object.keys(adminPostIds)
      .sort((a, b) => (getNumberOrZero(a) > getNumberOrZero(b) ? -1 : 1))
      .reduce((accumulator, key) => {
        accumulator.push({
          [key]: adminPostIds[key]
        });
        return accumulator;
      }, []);
    } else {
      adminPostIdsSorted = Object.keys(adminPostIds)
      .sort((a, b) => (getNumberOrZero(a) < getNumberOrZero(b) ? -1 : 1))
      .reduce((accumulator, key) => {
        accumulator.push({
          [key]: adminPostIds[key]
        });
        return accumulator;
      }, []);
    }

    // lastly need to sort all the replies to
    adminPostIdsSorted.forEach((item) => {
      for(const [key, value] of Object.entries(item)) {
        item[key].replies.sort(
          (a, b) => a.order - b.order
        );
      }
    });

    // replies are also sorted
    const postIds = [];
    // finally form the adminPostId array
    if (adminPostIdsSorted.length > 0) {
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
      // let temp = [];
      // data.rows.forEach(row => {
      //   // parsedMetaData['facebookPostsOrderAdminIds'].push(row.adminPostId);
      //   temp.push(row._id);
      // });

      // console.log('temptemp: ', temp);

      adminPostIdsSorted.forEach((item) => {
        for(const [key, value] of Object.entries(item)) {
          if (item[key]._id) postIds.push(item[key]._id);
          parsedMetaData['facebookPostsOrderAdminIds'].push(key);
          // also push all the reply id
          item[key].replies.forEach((reply) => {
            if (reply._id) {
              postIds.push(reply._id);
              parsedMetaData['facebookPostsOrderAdminIds'].push(reply.adminPostId);
            }
          });
        }
      });

      // stringify again the metadata object and upsert it
      const stringify = JSON.stringify(parsedMetaData);
      console.log('Adding to User Global Tracking MetaData: ', stringify);
      let upsertObj = {};
      if (prevGlobalTrackingObj?._id) upsertObj['_id'] = prevGlobalTrackingObj._id;
      upsertObj.userId = req.userId;
      upsertObj.pageMetaData = stringify;
      upsertObj.pageId = pageId;

      await UserGlobalTracking.upsert(upsertObj, { transaction, logging: false });
      console.log('Metadata updated!');
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

    // fetch all the authors for this page
    const userPostAuthors = await UserPostAuthor.findAll({
      where: {
        pageId,
      },
      attributes: ['authorId', 'authorName', 'authorVerified', 'handle']
    }, { transaction });

    await transaction.commit();

    res.send({
      totalPosts: data.count,
      postIds: postIds,
      translations,
      authors: userPostAuthors
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
      order: db.sequelize.literal("FIND_IN_SET(UserPost._id,'"+postIds.join(',')+"')"),
      include: [
        {
          model: Media,
          as: 'attachedMedia',
        }
      ]
    }, { transaction, logging: false });

    console.log(`Fetching posts with order perserved: ${postIds}.`)

    const getAuthorMedia = async () => {
      for (const item of data) {
        const result = await Media.findOne({
          where: {
            authorId: item.dataValues.authorId
          }
        });
        item.dataValues.attachedAuthorPicture = result;
      }
      await transaction.commit();
      res.send({
        postDetails: data,
      });
    };
    await getAuthorMedia();
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
          attributes: ['_id', 'type', 'postMessage', 'isFake', 'adminPostId', 'linkTitle'],
        }
      ]
    }, { transaction, logging: false });

    console.log(`Fetching fake shared posts by user ${req.userId} on social media page with Id ${pageId}.`);

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
          attributes: ['_id', 'type', 'postMessage', 'isFake', 'adminPostId', 'linkTitle'],
        }
      ]
    }, { transaction, logging: false });

    console.log(`Fetching fake comments and likes by user ${req.userId} on social media page with Id ${pageId}.`);

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

const updatePost = async (req, res, next) => {
  let transaction;
  try {
    // fetch userId from middleware
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }

    const { type, id } = req.body;
    if (!type || !id) {
      res.status(400).send({
        message: "UserPost data required!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();
    // update the user object
    await UserPost.update({
      type
    }, {
      where: {
        _id: id,
        // userId: req.userId
      },
      transaction
    });

    console.log(`Updating post with ID ${id} for user ${req.userId}.`)
    await transaction.commit();

    res.send("Post was successfully updated.");
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Error occurred when updating Post."
    });
  }
};

const createNewReply = async (obj) => {
  let transaction;
  try {
    
    transaction = await db.sequelize.transaction();
    // create post
    let post = {
      postMessage: obj.postMessage || "",
      pageId: obj.pageId,
      type: obj.type,
      parentPostId: obj.parentPostId || null
    };
    await UserPost.create(obj, { transaction, logging: true });
    await transaction.commit();
  } catch (error) {
    console.log("Error in createNewReply function");
    // if we reach here, there were some errors thrown, therefore rollback the transaction
    if (transaction) await transaction.rollback();
  }
};


export default {
  createAction,
  createNewPost,
  getFacebookPostIds,
  getFacebookPostWithDetails,
  getFacebookFakeActionPosts,
  deleteAction,
  updatePost,
  createNewReply
};
