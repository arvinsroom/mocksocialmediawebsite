import uploadController  from "../controllers/upload-controller"
import { uploadFiles } from "../middleware/upload";

const express = require('express')
const router = express.Router()

router.post("/single", uploadFiles.single("file"), uploadController.uploadSingleFile);

// have a upper bound of max media upload of 200
router.post("/multiple", uploadFiles.array("files", 200), uploadController.uploadMultipleFiles);

export default router;
