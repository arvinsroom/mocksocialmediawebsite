import * as auth from "../controllers/auth-controller";
var express = require('express')
var router = express.Router()

router.post("/", auth.signInAdmin);

export default router;
