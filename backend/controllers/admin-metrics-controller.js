import db from "../clients/database-client";
import { isNumeric } from '../utils';

const getUserData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId, limit, offset } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    if (!isNumeric(limit)) {
      res.status(400).send({
        message: "Invalid limit number!"
      });
      return;
    }
    if (!isNumeric(offset)) {
      res.status(400).send({
        message: "Invalid offset number!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    console.log(`Fetching allUserData for template with ID ${templateId}`);

    const allUserData = await db.User.findAll({
      where: {
        templateId,
      },
      order: [
        ['startedAt', 'ASC']
      ],
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          where: {
            _id: templateId
          },
          model: db.Template,
          as: 'template',
          attributes: [
            ['name', 'templateName'],
            'templateCode',
            'language'
          ],
        },
        {
          model: db.UserAnswer,
          as: 'userQuestionAnswers',
          attributes: {
            exclude: ['userId'],
          },
          include: [
            // {
            //   model: db.Question,
            //   as: 'question',
            // },
            {
              model: db.McqOption,
              as: 'mcqOption',
              attributes: ['optionText']
            }
          ]
        },
        {
          model: db.UserGlobalTracking,
          as: 'userGlobalTracking',
          attributes: ['pageMetaData', 'createdAt'],
          include: [
            {
              model: db.Page,
              as: 'pageConfigurations',
              attributes: ['_id'],
            }
          ]
        },
        {
          model: db.UserPostTracking,
          as: 'userPostTracking',
          attributes: ['userPostId'],
          include: [
            {
              // we might need to show adminId where applicable
              model: db.UserPost,
              as: 'userPosts',
              attributes: ['_id', 'adminPostId']
            }
          ]
        },
        {
          model: db.UserRegister,
          as: 'userRegisterations',
          attributes: {
            exclude: ['image', 'userId']
          },
          include: [
            {
              // we might need to show adminId where applicable
              model: db.Register,
              as: 'Register',
              attributes: ['type', 'displayName', 'referenceName']
            }
          ]
        }
      ]
    }, { transaction, logging: false });

    await transaction.commit();

    res.send({
      allUserData: allUserData || [],
    });
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching metrics data."
    });
  }
};

const getUsersPostsData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId, limit, offset } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    if (!isNumeric(limit)) {
      res.status(400).send({
        message: "Invalid limit number!"
      });
      return;
    }
    if (!isNumeric(offset)) {
      res.status(400).send({
        message: "Invalid offset number!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    console.log(`Fetching allUsersPostsData for template with ID ${templateId}`);

    const allUsersPostsData = await db.User.findAll({
      where: {
        templateId,
      },
      order: [
        ['startedAt', 'ASC']
      ],
      // we do not need other attr
      attributes: ['_id', 'startedAt'],
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          // will only select the posts which have userId associated with them
          model: db.UserPost,
          as: 'userPosts',
          attributes: ['_id', 'adminPostId', 'postMessage', 'type', 'isReplyTo', 'quoteTweetTo'],
          include: [
            {
              // fetch any media associated with user created post
              model: db.Media,
              as: 'attachedMedia',
              attributes: ['_id']
            },
            {
              // for shared post fetch its parent post data
              model: db.UserPost,
              as: 'parentUserPost',
              // we only require parentAdminPostId and/or its primary id
              attributes: ['_id', 'adminPostId'],
              // include: [
              //   {
              //     // fetch any media associated with its parent post
              //     model: db.Media,
              //     as: 'attachedMedia',
              //     attributes: {
              //       exclude: ['media', 'userPostId', 'isThumbnail']
              //     }
              //   }
              // ]
            }
          ]
        }
      ]
    }, { transaction, logging: false });

    await transaction.commit();

    res.send({
      allUsersPostsData: allUsersPostsData || [],
    });
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching userpost metrics data."
    });
  }
};

const getUsersPostsActionsData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId, limit, offset } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    if (!isNumeric(limit)) {
      res.status(400).send({
        message: "Invalid limit number!"
      });
      return;
    }
    if (!isNumeric(offset)) {
      res.status(400).send({
        message: "Invalid offset number!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    console.log(`Fetching allUsersPostsActionsData for template with ID ${templateId}`);

    const allUsersPostsActionsData = await db.User.findAll({
      where: {
        templateId,
      },
      order: [
        ['startedAt', 'ASC']
      ],
      limit: Number(limit),
      offset: Number(offset),
      // we do not need other attr
      attributes: ['_id', 'startedAt'],
      include: [
        {
          model: db.UserPostAction,
          as: 'userPostActions',
          attributes: ['_id', 'action', 'comment'],
          include: [
            {
              // we might need to show adminId where applicable
              model: db.UserPost,
              as: 'userPosts',
              attributes: ['_id', 'adminPostId']
            }
          ]
        }
      ]
    }, { transaction, logging: false });

    await transaction.commit();

    res.send({
      allUsersPostsActionsData: allUsersPostsActionsData || [],
    });
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching userPostActions metrics data."
    });
  }
};

const getTemplatesWithUserCounts = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    const data = await db.Template.findAll({
      where: {
        adminId: req.adminId,
      },
      group: ['Template._id'],
      attributes: [
          [db.sequelize.fn("SUM", db.sequelize.literal('CASE WHEN user.\`_id\` is not null THEN 1 ELSE 0 end')), 'userEntries'],
          ['_id', 'templateId'],
          ['name', 'templateName']
      ],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: []
        }
      ]
    }, { transaction });
    await transaction.commit();
    res.send({
      response: data
    });
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching Templates with user Counts."
    });
  }
};

const downloadAllMedia = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    const data = await db.User.findAll({
      where: {
        templateId,
      },
      attributes: { 
        exclude: ['consent', 'finishedAt', 'qualtricsId', 'responseCode', 'startedAt', 'templateId']
      },
      include: [
        {
          // will only select the posts which have userId associated with them
          model: db.UserPost,
          as: 'userPosts',
          attributes: { 
            exclude: ['adminPostId', 'authorId', 'createdAt', 'datePosted', 'initLike',
              'isFake', 'isReplyTo', 'isReplyToOrder', 'link', 'linkPreview', 'linkTitle',
              'pageId', 'parentPostId', 'postMessage', 'sourceTweet', 'type', 'userId']
          },
          include: [
            {
              // fetch any media associated with user created post
              model: db.Media,
              as: 'attachedMedia',
              attributes: ['_id', 'mimeType', 'media'],
            }
          ]
        },
        {
          model: db.UserRegister,
          as: 'userRegisterations',
          attributes: {
            include: [
              ['image', 'media'],
              'mimeType', 
              '_id',
            ],
            exclude: [
              'image',
              'generalFieldValue',
              'registerId',
              'userId'
            ]
          }
        }
      ]
    }, { transaction, logging: false });
    await transaction.commit();

    res.send(data);
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching Template Media."
    });
  }
};

const getUserDataSocialMediaData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    console.log(`Fetching socialMediaPageData for template with ID ${templateId}`);

    const socialMediaPageData = await db.Template.findOne({
      where: {
        // adminId: req.adminId,
        _id: templateId,
      },
      include: [
        {
          // try to fetch all MCQ and OPENTEXT page
          where: {
            type: ['FACEBOOK', 'TWITTER']
          },
          model: db.Page,
          as: 'pageFlowConfigurations'
        }
      ],
    }, { transaction, logging: false });
    await transaction.commit();

    res.send({
      socialMediaPageData: socialMediaPageData || null,
    });
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching socialmedia metrics data."
    });
  }
};

const getUserDataQuestionData = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    console.log(`Fetching templateAdminPortalQuestionsData for template with ID ${templateId}`);

    const templateAdminPortalQuestionsData = await db.Template.findOne({
      where: {
        _id: templateId,
      },
      include: [
        {
          // try to fetch all MCQ and OPENTEXT page
          where: {
            type: ['OPENTEXT', 'MCQ']
          },
          model: db.Page,
          as: 'pageFlowConfigurations',
          include: [
            {
              // what to include when fetching pages
              model: db.Question,
              as: 'question'
            }
          ]
        }
      ],
    }, { transaction, logging: false});
    await transaction.commit();

    res.send({
      templateAdminPortalQuestionsData: templateAdminPortalQuestionsData || null,
    });
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching question metrics data."
    });
  }
};


export default {
  getUserData,
  getTemplatesWithUserCounts,
  downloadAllMedia,
  getUserDataSocialMediaData,
  getUserDataQuestionData,
  getUsersPostsActionsData,
  getUsersPostsData
}
