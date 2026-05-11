const express = require("express");
const router = express.Router();
const JWTValidation = require("../middlewares/auth");

const {
  getTemplates,
  updateTemplate,
  testSendTemplate,
} = require("../controllers/emailTemplate");

router.get("/", JWTValidation, getTemplates);
router.put("/:key", JWTValidation, updateTemplate);
router.post("/:key/test-send", JWTValidation, testSendTemplate);

module.exports = router;
