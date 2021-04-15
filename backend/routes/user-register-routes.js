import userRegister from "../controllers/user-register-controller";
import { uploadImage } from "../middleware/upload";

var express = require('express')
var router = express.Router()

router.get("/:pageId", userRegister.getRegisterDetails);

router.post("/", uploadImage.single("file"), userRegister.createUserRegister);

export default router;
