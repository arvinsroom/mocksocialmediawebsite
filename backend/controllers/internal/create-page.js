import db from "../../clients/database-client";
const Page = db.page;

const pageCreate = (pageObj) => {
  if (!pageObj.templateId) {
    throw "Template Id is required!";
  }
  if (!pageObj.name) {
    throw "Page name is required!";
  }
  if (!pageObj.type) {
    throw "Page type is required!";
  }

  // form a info object with required information
  const page = {
    templateId: pageObj.templateId,
    name: pageObj.name,
    type: pageObj.type,
  };
  
  Page.create(page)
    .then(data => {
      // return the id created
      return data._id;
    })
    .catch(err => {
      throw err.message || "Some error occurred while creating the Page record."
    });
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