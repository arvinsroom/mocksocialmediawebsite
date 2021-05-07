import db from "../clients/database-client";
import page from './create-page';
const User = db.User;
const Template = db.Template;
const Language = db.Language;
const UserGlobalTracking = db.UserGlobalTracking;
const jwt = require("jsonwebtoken");

let secret;
try {
  secret = require(__dirname + '/../config-' + process.env.NODE_ENV.toString() + '.json')['secretUser'];
} catch (error) {
  console.log('Please specify a config-production.json or config-development.json file!')
}

export const signInUser = async (req, res, next) => {
  const { templateId } = req.body;

  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }

  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const templateExist = await Template.findAll({
      where: {
        templateCode: req.body.templateId
      },
      order: db.sequelize.literal('rand()'),
      attributes: ['_id', 'videoPermission', 'audioPermission', 'cookiesPermission', 'language']
    }, { transaction });
    if (!templateExist || !templateExist[0]) {
      return res.status(404).send({ message: "No template exist with provided ID." });
    }
    const tempId = templateExist[0]._id;
    // template exist, create a record in User table
    const userRecord = await User.create({
      templateId: tempId,
    }, { transaction });

    // now we have user, add what template was selected
    await UserGlobalTracking.create({
      userId: userRecord._id,
      activeTemplateId: tempId,
    }, { transaction });
    
    let translations = null;
    if (!templateExist[0].language) {
      console.log('Template Language data has not been configured yet, default ENGLISH will be used!');
    } else {
      // fetch active language for the template
      translations = await Language.findOne({
        where: {
          templateId: tempId,
          name: templateExist[0].language,
          platform: 'GLOBAL',
        },
        attributes: ['name', 'translations']
      }, { transaction });
    }

    // fetch all flow configurations
    const flowConfig = await page.findAllPages(tempId, transaction);

    // if successful, will return created user object
    const token = jwt.sign({ _id: userRecord._id }, secret, {
      expiresIn: 86400 // 24 hours
    });

    // if reached here, no error
    await transaction.commit();

    res.status(200).send({
      accessToken: token,
      translations,
      flow: flowConfig,
      templateId: templateExist[0]._id
    });

  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({ message: 'Incorrect Template ID/Qualtrics ID!' });
  }
};
