import db from "../clients/database-client";
const Page = db.page;

const pageCreate = async (pageObj) => {
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
    const data = await Page.create({ ...pageObj });
    return data._id;
  } catch (error) {
    throw err.message || "Some error occurred while creating the Page record."
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
  

export default {
  create,
  findOne,
  pageCreate,
}