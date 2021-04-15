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
  const { templateId, qualtricsId } = req.body;
  console.log('templateId: ', templateId);
  console.log('qualtricsId: ', qualtricsId);

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
      attributes: ['_id', 'videoPermission', 'audioPermission', 'cookiesPermission']
    }, { transaction });
    if (!templateExist || !templateExist[0]) {
      return res.status(404).send({ message: "No template exist with provided ID." });
    }
    const tempId = templateExist[0]._id;

    // template exist, create a record in User table
    const userRecord = await User.create({
      templateId: tempId,
      qualtricsId,
    }, { transaction });
    // now we have user, add what template was selected
    await UserGlobalTracking.create({
      userId: userRecord._id,
      activeTemplateId: tempId,
    }, { transaction });

    // fetch active language data
    const translations = await Language.findOne({
      where: {
        templateId: tempId,
        isActive: true,
      },
      attributes: ['name', 'platform', 'translations']
    }, { transaction });
    // if no active languages provided fetch throw error
    if (!translations) {
      return res.status(404).send({ message: "Template Language data has not been configured yet." });
    }
    // if active exist fetch a fallback template for that platform with English language data
    const defaultTranslations = await Language.findOne({
      where: {
        templateId: tempId,
        name: 'ENGLISH',
        platform: translations.platform
      },
      attributes: ['name', 'platform', 'translations']
    }, { transaction });

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
      translations: {
        name: translations.name,
        platform: translations.platform,
        translations: JSON.parse(translations.translations),
      },
      defaultTranslations: {
        name: defaultTranslations.name,
        platform: defaultTranslations.platform,
        translations: JSON.parse(defaultTranslations.translations),
      },
      flow: flowConfig,
      template: templateExist[0]
    });

  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};
