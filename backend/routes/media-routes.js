import media from "../controllers/media-controller";
var express = require('express');
var router = express.Router();

router.post("/", media.create);

export default router;
