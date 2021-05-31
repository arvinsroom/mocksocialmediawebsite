import db from "../clients/database-client";
const Page = db.Page;

const getAllPages = async (req, res, next) => {
  let transaction;
  try {
    // fetch the adminId added from middleware
    if (!req.adminId) {
      res.status(400).send({
        message: "Invalid Token, please log in again!"
      });
      return;
    }

    // fetch template _id from params
    const _id = req.params._id;
    if (!_id) {
      res.status(400).send({
        message: "Invalid Template Id!"
      });
      return;
    }
    
    transaction = await db.sequelize.transaction();
    const data = await Page.findAll({
      where: {
        templateId: _id
      },
      attributes: ['_id', 'name', 'type', 'flowOrder']
    }, { transaction });
    await transaction.commit();

    res.send(data);
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while fetching all pages for given template Id!"
    });
  }
};

// for now we only need to update the flow
// {_id: '', flowOrder: ''}, {key is page id }
const updatePage = async (req, res, next) => {
  const { pageObj } = req.body;
  if (!pageObj) {
    res.status(400).send({
      message: "Update page object of order is required!"
    });
    return;
  }
  // form a template object with required information
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const promises = [];
    for (const [page_id, flowOrder] of Object.entries(pageObj)) {
      promises.push(Page.update({
        flowOrder: flowOrder
      }, {
        where: {
          _id: page_id
        },
        transaction
      }
      ));
    }
    let data = await Promise.all(promises);
    await transaction.commit();
    res.send({
      data
    });
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while updating orders!"
    });
  }
};

const getSocialMediaPages = async (req, res, next) => {
  // fetch the adminId added from middleware
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }

  // fetch template _id from params
  const _id = req.params._id;
  if (!_id) {
    res.status(400).send({
      message: "Invalid Template Id!"
    });
    return;
  }

  try {
    const socialMediaPages = ['FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM',
    'YOUTUBE', 'SLACK', 'TIKTOK'];
    const data = await Page.findAll({
      where: {
        templateId: _id,
        type: socialMediaPages
      },
      attributes: ['_id', 'name']
    });
    res.send({
      data
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching all pages for given template Id!"
    });
  }
};

const deletePage = async (req, res, next) => {
  // fetch the adminId added from middleware
  if (!req.adminId) {
    res.status(400).send({
      message: "Invalid Token, please log in again!"
    });
    return;
  }

  // fetch template _id from params
  const _id = req.params._id;
  if (!_id) {
    res.status(400).send({
      message: "Invalid Page Id!"
    });
    return;
  }

  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    await Page.destroy({
      where: {
        _id
      },
      transaction
    });
    await transaction.commit();

    res.send({
      message: "Page was successfully deleted."
    });
  } catch (error) {
    console.log(error.message);
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Error occurred when deleting given Page."
    });
  }
};


export default {
  updatePage,
  getAllPages,
  getSocialMediaPages,
  deletePage
}