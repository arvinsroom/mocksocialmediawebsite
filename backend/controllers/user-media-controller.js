import db from "../clients/database-client";
// import Chance from 'chance';
const AdminPost = db.AdminPost;
const Media = db.Media;
// const chance = new Chance();

const getDefaultPosts = async (req, res, next) => {
  try {
    // fetch template _id from params
    const pageId = req.params.pageId;
    if (!pageId) {
      res.status(400).send({
        message: "Invalid Page Id!"
      });
      return;
    }
  
    const data = await AdminPost.findAll({
      where: {
        pageId: pageId,
      },
      include: [
        {
          model: Media,
          as: 'attachedMediaAdmin',
        }
      ]
    });

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
