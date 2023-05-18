import adminUserPost  from "../controllers/admin-userpost-controller"
var express = require('express')
var router = express.Router()

router.get("/mediapage/:templateId/:pageId", adminUserPost.getAdminPosts);

router.post("/mediapage/labels", adminUserPost.createAdminPostsLabels);


export default router;