import db from "../clients/database-client";
const Page = db.Page;

const pageCreate = async (pageObj, transaction) => {
  if (!pageObj.templateId) {
    throw "Template Id is required!";
  }
  if (!pageObj.name) {
    throw "Page name is required!";
  }
  if (!pageObj.type) {
    throw "Page type is required!";
  }
  
  try {
    const data = await Page.create(pageObj, { transaction });
    return data._id;
  } catch (error) {
    console.log(error.message);
    throw error.message || "Some error occurred while creating the Page record."
  }
};

// get page data using pageId
const findOne = (req, res) => {
  const _id = req.params._id;

  Page.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Page with id=" + id
      });
    });
};


// get all pages (flow) data using template Id
const findAllPages = async (templateId) => {
  try {
    const pages = await Page.findAll({
      where: {
        templateId
      },
      order: [
        ['order', 'ASC']
      ]
    });
    return pages;
  } catch (error) {
    throw error;
  }
};


export default {
  findOne,
  pageCreate,
  findAllPages
}