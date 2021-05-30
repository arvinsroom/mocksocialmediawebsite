import userMain from "../controllers/user-main-controller";
var express = require('express')
var router = express.Router()

router.post("/", userMain.update);

export default router;
