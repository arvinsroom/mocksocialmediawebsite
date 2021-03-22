import db from "../clients/database-client";
const Page = db.Page;

const getAllPages = async (req, res, next) => {
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
    const data = await Page.findAll({
      where: {
        templateId: _id
      },
      attributes: ['_id', 'name', 'type', 'order']
    });
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching all pages for given template Id!"
    });
  }
};

// for now we only need to update the flow
// {_id: '', order: ''}, {key is page id }
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
    for (const [page_id, order] of Object.entries(pageObj)) {
      promises.push(Page.update({
        order: order
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

export default {
  updatePage,
  getAllPages
}