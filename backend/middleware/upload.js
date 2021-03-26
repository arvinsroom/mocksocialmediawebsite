const multer = require("multer");
const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb("Please upload only images or videos.", false);
  }
};

const filterSingleImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only a image.", false);
  }
};

export const uploadImage = multer({ fileFilter: filterSingleImage });

export const uploadFiles = multer({ fileFilter: filter });
