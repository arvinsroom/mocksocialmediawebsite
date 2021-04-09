import db from "../clients/database-client";
// import Chance from 'chance';
const AdminPost = db.AdminPost;
const Media = db.Media;
const User = db.User;
// const chance = new Chance();

const getDefaultPosts = async (req, res, next) => {
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
    let data = null;
    // order: db.sequelize.literal('rand()'),
    // order can be DESC, ASC and RANDOM
    const order = req.params.random;
    if (order === 'RANDOM') {
      data = await AdminPost.findAll({
        where: {
          pageId: pageId,
        },
        order: db.sequelize.literal('rand()'),
        include: [
          {
            model: Media,
            as: 'attachedMediaAdmin',
          }
        ]
      });
    } else if (order === 'DESC') {
      data = await AdminPost.findAll({
        where: {
          pageId: pageId,
        },
        order: [
          ['_id', 'DESC']
        ],
        include: [
          {
            model: Media,
            as: 'attachedMediaAdmin',
          }
        ]
      });
    } else {
      // keep default as ASC or anyotherfallback
      data = await AdminPost.findAll({
        where: {
          pageId: pageId,
        },
        order: [
          ['_id', 'ASC']
        ],
        include: [
          {
            model: Media,
            as: 'attachedMediaAdmin',
          }
        ]
      });
    }
    // fetch the renderering order and store that in database
    let postRenderMetadata = [];
    if (data) {
      data.forEach(element => {
        postRenderMetadata.push(element._id);
      });
    }
    if (postRenderMetadata.length > 0) {
      const stringify = JSON.stringify({ postFlowOrder: postRenderMetadata });
      await User.update({ metaData: stringify }, {
        where: {
          _id: req.userId,
        }
      });
    }
    // add random names for user 
    // if (data) {
    //   data.forEach(element => {
    //     element['name'] = chance.name();
    //   });
    // }

    // if (data) {
    //   for(let i = 0; i < data.length; i++) {
    //     if (data[i].thumbnail) {
    //       const newThumbnail = new Blob(data[i].thumbnail);
    //       data[i].thumbnail = newThumbnail;
    //     }
    //   }
    // }

    // console.log(data);
    res.send({
      data: data,
    });
  
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        message:
          error.message || "Some error occurred while Fetching default media post(s)."
      });
    }
};

export default {
  getDefaultPosts,
}
