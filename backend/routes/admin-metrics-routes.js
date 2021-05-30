import adminMetrics  from "../controllers/admin-metrics-controller"
var express = require('express')
var router = express.Router()

// remove the adminId
router.get("/allusers/:templateId", adminMetrics.getUserData);

router.get("/templates/allusers/counts", adminMetrics.getTemplatesWithUserCounts);


export default router;
