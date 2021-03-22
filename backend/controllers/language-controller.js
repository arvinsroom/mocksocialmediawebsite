import db from "../clients/database-client";
const Language = db.Language;

const create = async (req, res, next) => {
  const { templateId, languageData } = req.body;
  if (!templateId) {
    res.status(400).send({
      message: "Template Id is required!"
    });
    return;
  }
  if (!languageData && Array.isArray(languageData) && languageData.length > 0) {
    res.status(400).send({
      message: "Language data is required!"
    });
    return;
  }

  // create the page first
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    // store total languages
    let languageName = [];
    if (languageData[0].length > 0) {
      for (let i = 1; i < languageData[0].length; i++) {
        // handle empty case
        if (!languageData[0][i]) break;
        // get uppercase language name
        let key = languageData[0][i].toUpperCase().split(' ').join('_');
        languageName.push(key);
      }
    }
    let obj = {};
    for (let i = 1; i < languageData.length; i++) {
      // handle empty array case, nulify everything after
      if (!languageData[i] || languageData[i].length < 1) break;
      let platform = languageData[i][0].toUpperCase().split(' ').join('_');
      // force to go # of languages times o/w store null there
      for (let j = 1; j <= languageName.length; j++) {
        // if i == 1, then language name will be at index 1 in languageName
        // this is english keywords which are made keys, must need them
        let translationKey = languageData[i][1].toLowerCase().split(' ').join('_');
        // set platform first
        if (!obj[platform]) obj[platform] = {};
        if (!obj[platform][languageName[j - 1]]) obj[platform][languageName[j - 1]] = {};
        if (!obj[platform][languageName[j - 1]][translationKey]) obj[platform][languageName[j - 1]][translationKey] = languageData[i][j] || null;
      }
    }
    const languageArr = [];
    const entries = Object.entries(obj);
    for (const [platform, languageObj] of entries) {
      // create entries for each language obj
      const entriesLan = Object.entries(languageObj);
      for (const [language, translations] of entriesLan) {
        // push each platform and language specific entry in the database
        let lanObj = {};
        lanObj.platform = platform;  
        lanObj.templateId = templateId;
        lanObj.name = language;
        lanObj.translations = JSON.stringify(translations);
        lanObj.isActive = 0; // default nothing is active
        languageArr.push(lanObj);
      }
    }
    // destroy all records for given template ID before creating,
    await Language.destroy({
      where: {
        templateId: templateId
      },
      transaction
    });

    // create the language records
    const data = await Language.bulkCreate(languageArr, {
      transaction,
      updateOnDuplicate: ["templateId"]
    });
    // fetch all the ids created for post
    const ids = data.map(item => {
      return item._id;
    });
    // if we reach here, there were no errors therefore commit the transaction
    await transaction.commit();

    // add response for _id of all questions with specific page id's
    res.send({
      ids
    });
  } catch (error) {
    console.log(error.message);
    // if we reach here, there were some errors thrown, therefore roolback the transaction
    if (transaction) await transaction.rollback();
    res.status(500).send({
      message: "Some error occurred while creating the Languages record(s)."
    });
  }
};

const getLanguages = async (req, res, next) => {
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
    const data = await Language.findAll({
      where: {
        templateId: _id
      },
      attributes: ['_id', 'name', 'platform', 'isActive']
    });
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Some error occurred while fetching all languages for template Id!"
    });
  }
};

const updateLanActive = async (req, res, next) => {
  const { templateId, currentActive } = req.body;

  // fetch template _id from params
  if (!templateId) {
    res.status(400).send({
      message: "Templpate Id is required!"
    });
    return;
  }
  if (!currentActive) {
    res.status(400).send({
      message: "Selection of updated language is required!"
    });
    return;
  }

  // form a template object with required information
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    // fetch all language _id of previous data associated with this template Id
    const prevResult = await Language.findOne({
      where: {
        templateId: templateId,
        isActive: true,
      },
      attributes: ['_id']
    });
    let promises = [];
    if (!prevResult) {
      // null, first time case  just update the given language _id record
      promises.push(Language.update({
          isActive: true
        }, {
          where: {
            _id: currentActive,
            templateId: templateId
          },
          transaction
        })
      );
    }
    else if (prevResult && prevResult._id === currentActive) {
      // same secord already exist, no need to change
      res.send("Current Active is already set, nothing done!");
    }
    else {
      // set the new language _id as active, true
      promises.push(Language.update({
          isActive: true
        }, {
          where: {
            _id: currentActive,
            templateId: templateId
          },
          transaction
        })
      );
      // set the old language _id as active, false
      promises.push(Language.update({
          isActive: false
        }, {
          where: {
            _id: prevResult._id,
            templateId: templateId
          },
          transaction
        })
      );
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
  create,
  getLanguages,
  updateLanActive,
}
