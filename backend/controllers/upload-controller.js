import db from "../clients/database-client";
const AdminPost = db.AdminPost;
const Media = db.Media;

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

const toArrayBuffer = (buf) => {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

const uploadMultipleFiles = async (req, res, next) => {
  // create  the page first
  let transaction;

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

    transaction = await db.sequelize.transaction();
    let promisses = [];
    // console.log('req.file: ', files);
    // console.log(typeof files[0].buffer);

    // window.global = window;
    // window.Buffer = window.Buffer || require('buffer').Buffer;
    // let bufferd = window.Buffer.from(buffer.thumbnail.data);
    // let arraybuffer = Uint8Array.from(bufferd).buffer;
    for (let i = 0; i < files.length; i++) {
      const postId = files[i].originalname.split(".")[0];
      // only create media entry where post id exist
      const adminPostExistAndType = await AdminPost.findOne({
        where: {
          _id: postId,
          templateId: templateId,
        },
        attributes: ['type']
      }, { transaction });

      // should only create entry if post id exist
      if (adminPostExistAndType) {
        // we should add media as a thumbnail
        promisses.push(Media.create({
          mimeType: files[i].mimetype,
          media: files[i].buffer,
          adminPostId: postId,
          isThumbnail: adminPostExistAndType.type === 'LINK' ? true : false
        }, {
            transaction
          })
        );
      }
    }
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
