import userRegister from "../controllers/user-register-controller";
import { uploadFiles } from "../middleware/upload";

var express = require('express')
var router = express.Router()

router.get("/:pageId", userRegister.getRegisterDetails);

router.post("/", uploadFiles.any("files"), userRegister.createUserRegister);

export default router;
