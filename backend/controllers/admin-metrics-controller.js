import db from "../clients/database-client";

const Template = db.Template;

const getUserData = async (req, res, next) => {
  // fetch the adminId added from middleware
  // if (!req.adminId) {
  //   res.status(400).send({
  //     message: "Invalid Token, please log in again!"
  //   });
  //   return;
  // }

  const { adminId, templateId, userId } = req.params;

  let whereClauseTemplate = {
    adminId: adminId,
  };
  let whereClauseUser = null;
  try {
    if (templateId && userId) {
      console.log(`Fetching user details for Template with templateId ${templateId} and user with userId ${userId}.`);
      whereClauseTemplate._id = templateId;
      whereClauseUser = {
        _id: userId
      };
    } else if (templateId && !userId) {
      console.log(`Fetching all users details for Template with templateId ${templateId}`);
      whereClauseTemplate._id = templateId;
    } else {
      console.log(`Fetching all Template and User details for Admin with admin Id ${req.adminId}`);
    }
    // normalize as much as we can
    const data = await Template.findAll({
      where: whereClauseTemplate,
      attributes: {
        include: [
          ['_id', 'templateId'],
          ['videoPermission', 'Requested Video Permission'],
          ['audioPermission', 'Requested Audio Permission'],
          ['cookiesPermission', 'Requested Cookies Permission'],
          ['name', 'Template Name'],
          ['qualtricsId', 'Requested Qualtrics Id'],
        ],
        exclude: ['_id', 'videoPermission', 'audioPermission', 'cookiesPermission', 'name', 'qualtricsId']
      },
      include: [
        {
          where: whereClauseUser,
          model: db.User,
          as: 'user',
          attributes: {
            include: [
              ['_id', 'userId']
            ],
            exclude: ['templateId', '_id']
          },
          include: [
            {
              model: db.UserPostAction,
              as: 'userPostActions',
              attributes: {
                exclude: ['userId', '_id', 'userPostId', 'adminPostId']
              },
              include: [
                {
                  model: db.UserPost,
                  as: 'userPosts',
                  attributes: ['_id'],
                  // include: [
                  //   {
                  //     model: db.Media,
                  //     as: 'attachedMediaUser',
                  //     attributes: {
                  //       exclude: ['media', 'adminPostId', 'userPostId']
                  //     }
                  //   }
                  // ],
                },
                {
                  model: db.AdminPost,
                  as: 'adminPosts',
                  attributes: ['_id'],
                  // include: [
                  //   {
                  //     model: db.Media,
                  //     as: 'attachedMedia',
                  //     attributes: {
                  //       exclude: ['media', 'adminPostId', 'userPostId']
                  //     }
                  //   }
                  // ],
                },
              ]
            },
            {
              model: db.UserRegister,
              as: 'userRegisterations',
              attributes: {
                exclude: ['profilePic', 'userId']
              }
            },
            {
              model: db.UserAnswer,
              as: 'userQuestionAnswers',
              attributes: {
                include: [
                  ['_id', 'userResponseId']
                ],
                exclude: ['userId', '_id', 'questionId', 'mcqOptionId']
              },
              include: [
                {
                  model: db.Question,
                  as: 'question',
                  attributes: {
                    exclude: ['_id', 'pageId']
                  },
                },
                {
                  model: db.McqOption,
                  as: 'mcqOption',
                  attributes: ['optionText']
                }
              ]
            }
          ]
        },
        {
          model: db.Page,
          as: 'pageFlowConfigurations',
          attributes: {
            exclude: ['templateId', '_id']
          },
          include: [
            {
              model: db.Register,
              as: 'register',
              attributes: {
                exclude: ['_id', 'templateId', 'pageId']
              },
            },
            {
              model: db.Finish,
              as: 'finish',
              attributes: {
                exclude: ['_id', 'templateId', 'pageId']
              },
            },
            {
              model: db.Info,
              as: 'info',
              attributes: {
                exclude: ['_id', 'templateId', 'pageId']
              },
            },
            {
              model: db.Question,
              as: 'question',
              attributes: {
                exclude: ['_id', 'pageId']
              },
              include: [
                {
                  model: db.McqOption,
                  as: 'mcqOption',
                  attributes: {
                    exclude: ['_id', 'questionId']
                  },
                }
              ]
            },
          ]
        },
      ],
      // required: true
    });

    // process all the admin and user posts differently and fetch any media associated with them
    const userPosts = [];
    const adminPosts = [];

    res.send({
      data,
      userPosts,
      adminPosts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching Metrics data."
    });
  }
};

const getTemplatesWithUserCounts = async (req, res, next) => {
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const data = await Template.findAll({
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
    });

    res.send({
      response: data
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching Templates with user Counts."
    });
  }
};

export default {
  getUserData,
  getTemplatesWithUserCounts
}