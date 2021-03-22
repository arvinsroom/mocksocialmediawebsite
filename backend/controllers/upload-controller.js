import db from "../clients/database-client";
const AdminPost = db.AdminPost;

const uploadSingleFile = async (req, res, next) => {
  try {
    const { templateId } = req.body;
    if (!req.file) {
      res.status(400).send({
        message: "You must select a file!"
      });
      return;
    }
    if (!templateId) {
      res.status(400).send({
        message: "Template Id is required!"
      });
      return;
    }

    // create  the page first
    let transaction;

    transaction = await db.sequelize.transaction();
    // get the post id from the file
    const postId = req.file.originalname.split(".")[0];
    const adminPostImageData = {
      thumbnail: req.file.buffer
    };
    console.log(adminPostImageData.thumbnail);
    
    // now create a entry for register
    const data = await AdminPost.update(adminPostImageData, {
      where: {
        templateId: templateId,
        _id: postId
      }
    }, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send("File(s) has been uploaded.");
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while storing post media."
    });
  }
};

const uploadMultipleFiles = async (req, res, next) => {
  try {
    const { templateId } = req.body;
    const { files } = req;

    if (!files) {
      res.status(400).send({
        message: "You must provide a file!"
      });
      return;
    }
    if (!templateId) {
      res.status(400).send({
        message: "Template Id is required!"
      });
      return;
    }

    // create  the page first
    let transaction;

    transaction = await db.sequelize.transaction();
    let promisses = [];

    files.forEach(file => {
      const postId = file.originalname.split(".")[0];
      const thumbnail = file.buffer;
      promisses.push(
        AdminPost.update({ thumbnail }, {
          where: {
            templateId: templateId,
            _id: postId
          }
        }, { transaction })
      );
    });
    const data = await Promise.all(promisses);

    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send({
      data
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while storing multi post media."
    });
  }
};

export default {
  uploadSingleFile,
  uploadMultipleFiles
}
