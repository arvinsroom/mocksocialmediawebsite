import db from "../clients/database-client";
const UserRegister = db.UserRegister;
const Register = db.Register;

const getRegisterDetails = async (req, res, next) => {
  try {
    // fetch template _id from params
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }
  
    const data = await Register.findOne({
      where: {
        pageId: pageId
      },
      attributes: ['profilePic', 'username']
    });
  
    res.send({
      data: data,
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
    const { username } = req.body;
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!"
      });
      return;
    }
        
    // create  the page first
    transaction = await db.sequelize.transaction();
    // get the post id from the file
    const userRegisterData = {
      profilePic: req.file ? req.file.buffer : null,
      username: username || null,
      userId: req.userId
    };
    
    // now create a entry for register
    const data = await UserRegister.create(userRegisterData, { transaction });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();
    // fetch json
    res.send(data);
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while saving user registration deatils."
    });
  }
};

export default {
  getRegisterDetails,
  createUserRegister,
}