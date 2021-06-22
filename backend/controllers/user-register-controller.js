import db from "../clients/database-client";
const UserRegister = db.UserRegister;
const Register = db.Register;

const getRegisterDetails = async (req, res, next) => {
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    // fetch template _id from params
    const pageId = req.params.pageId;

    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }
  
    const data = await Register.findAll({
      where: {
        pageId: pageId
      },
      order: [
        ['order', 'ASC']
      ],
    });

    res.send({
      response: data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message:
        error.message || "Some error occurred while Fetching the Register details."
    });
  }
};

const createUserRegister = async (req, res, next) => {
  let transaction;
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
    transaction = await db.sequelize.transaction();

    const { registerIds } = req.body;
    const { files } = req;

    // parse registerIds
    const parseRegisterIdsArr = JSON.parse(registerIds);
    const userRegisterData = [];
    // fetch each entry data from req body and form the userRegisterData
    for(let i = 0; i < parseRegisterIdsArr.length; i++) {
      const id = parseRegisterIdsArr[i];
      // filter out the files ids
      const fieldValue = req.body[id];
      if (fieldValue) {
        userRegisterData.push({
          registerId: id,
          userId: req.userId,
          generalFieldValue: req.body[id]
        });
      }
    }
    
    // process the files array now
    for (let i = 0; i < files.length; i++) {
      // fetch the id from file name
      const registerId = files[i].originalname.split(".")[0];
      // should only create entry if post id exist
      userRegisterData.push({
        mimeType: files[i].mimetype,
        image: files[i].buffer,
        registerId: registerId,
        userId: req.userId
      });
    }

    // now create all entries for register
    await UserRegister.bulkCreate(userRegisterData, {
      transaction,
      logging: false
    });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    res.send({
      response: "Success!"
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while saving user registration details."
    });
  }
};

export default {
  getRegisterDetails,
  createUserRegister,
}