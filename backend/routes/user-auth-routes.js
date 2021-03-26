import * as auth from "../controllers/user-auth-controller";
var express = require('express')
var router = express.Router()

router.post("/", auth.signInUser);

export default router;
