import facebook from "../controllers/facebook-controller"
import { uploadFiles } from "../middleware/upload";

var express = require('express')
var router = express.Router()

router.post("/posts", facebook.getFacebookPostWithDetails);

router.get("/:templateId/:platform/:language/:pageId/:order", facebook.getFacebookPostIds);

router.get("/fake/actions/:pageId", facebook.getFacebookFakeActionPosts);

router.post("/action", facebook.createAction);

router.post("/new", uploadFiles.single("file"), facebook.createNewPost);

router.delete("/action/:_id", facebook.deleteAction);

router.post("/post", facebook.updatePost);

export default router;
