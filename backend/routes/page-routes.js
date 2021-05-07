import page from "../controllers/page-controller";
var express = require('express');
var router = express.Router();

router.get("/socialmedia/:_id", page.getSocialMediaPages);

router.get("/:_id", page.getAllPages);

router.put("/", page.updatePage);

export default router;
