import media from "../controllers/media-controller";
import { uploadFiles } from "../middleware/upload";

var express = require('express');
var router = express.Router();

router.post("/", media.create);

// have a upper bound of max media upload of 200
router.post("/upload/multiple", uploadFiles.array("files", 200), media.uploadMultipleFiles);

// have a upper bound of max media upload of 200
router.post("/upload/multiple/authors", uploadFiles.array("files", 200), media.uploadMultipleAuthourFiles);

export default router;
