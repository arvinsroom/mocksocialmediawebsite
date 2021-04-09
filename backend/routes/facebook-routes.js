import facebook from "../controllers/facebook-controller"
import { uploadFiles } from "../middleware/upload";

var express = require('express')
var router = express.Router()

router.post("/action", facebook.createAction);

router.post("/share", facebook.createSharePost);

router.post("/new", uploadFiles.single("file"), facebook.createNewPost);

router.delete("/action/:_id", facebook.deleteAction);

export default router;
