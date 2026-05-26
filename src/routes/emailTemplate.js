const express = require("express");
const router = express.Router();
const JWTValidation = require("../middlewares/auth");
const requireRoles = require("../middlewares/requireRoles");
const { COMMUNICATION_ROLES } = require("../utils/roles");

const {
  getTemplates,
  updateTemplate,
  testSendTemplate,
} = require("../controllers/emailTemplate");

router.get("/", JWTValidation, requireRoles(COMMUNICATION_ROLES), getTemplates);
router.put("/:key", JWTValidation, requireRoles(COMMUNICATION_ROLES), updateTemplate);
router.post("/:key/test-send", JWTValidation, requireRoles(COMMUNICATION_ROLES), testSendTemplate);

module.exports = router;
