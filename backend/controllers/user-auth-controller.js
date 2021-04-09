import db from "../clients/database-client";
import page from './create-page';
const User = db.User;
const Template = db.Template;
const Language = db.Language;
const secret = require(__dirname + '/../config/config.json')['secretUser'];
const jwt = require("jsonwebtoken");

export const signInUser = async (req, res, next) => {
  const { templateId, qualtricsId } = req.body;
  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }

  let transaction;
  try {
    const templateExist = await Template.findOne({
      where: {
        _id: req.body.templateId
      },
      attributes: ['videoPermission', 'audioPermission', 'cookiesPermission', 'qualtricsId']
    });
    if (!templateExist) {
      return res.status(404).send({ message: "No template exist with provided ID." });
    }

    transaction = await db.sequelize.transaction();
    // template exist, create a record in User table
    const userRecord = await User.create({
      templateId,
      qualtricsId,
    }, { transaction });

    // fetch active language data
    const translations = await Language.findOne({
      where: {
        templateId: templateId,
        isActive: true,
      },
      attributes: ['name', 'platform', 'translations']
    });
    // if no active languages provided fetch throw error
    if (!translations) {
      return res.status(404).send({ message: "Template Language data has not been configured yet." });
    }
    // if active exist fetch a fallback template for that platform with English language data
    const defaultTranslations = await Language.findOne({
      where: {
        templateId: templateId,
        name: 'ENGLISH',
        platform: translations.platform
      },
      attributes: ['name', 'platform', 'translations']
    });

    // fetch all flow configurations
    const flowConfig = await page.findAllPages(templateId);

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
      template: templateExist
    });

  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};
