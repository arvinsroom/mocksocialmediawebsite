import db from "../clients/database-client";
const UserPost = db.UserPost;

const getAdminPosts = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    const { templateId, pageId } = req.params;
    if (!templateId) {
      res.status(400).send({
        message: "Invalid template Id!"
      });
      return;
    }
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }
    console.log(`Fetching Admin Posts for template with ID ${templateId} and page with ID ${pageId}`);

    const whereClause = {
      [db.Sequelize.Op.and]: [
        { pageId: pageId },
        { userId: null }
      ]
    };

    transaction = await db.sequelize.transaction();
    let data = null;
    data = await UserPost.findAll({
      where: whereClause,
      order: [
        ['adminPostId', 'ASC'],
      ],
      attributes: ['adminPostId', '_id', 'type', 'postMessage', 'warningLabel', 'labelRichText', 'checkersLink']
    }, { transaction });

    await transaction.commit();
    res.send({
      response: data
    });
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: `Error: ${error.message ? error.message : error}`
    });
  }
};

const createAdminPostsLabels = async (req, res, next) => {
  let transaction;
  try {
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    transaction = await db.sequelize.transaction();
    const postLabelData = JSON.parse(req.body.data);
    const promises = [];
    for (const [key, value] of Object.entries(postLabelData)) {
      promises.push(UserPost.update({
        warningLabel: value?.label || null,
        labelRichText: value?.richText || "",
        checkersLink: value?.link || ""
      }, {
        where: {
          _id: key
        },
        transaction
      }
      ));
    }
    await Promise.all(promises);
    await transaction.commit();

    res.send({
      response: "Success!"
    });
    
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: `Error: ${error.message ? error.message : error}`
    });
  }
};

export default {
  getAdminPosts,
  createAdminPostsLabels
}