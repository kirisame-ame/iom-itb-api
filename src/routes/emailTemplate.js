const express = require("express");
const router = express.Router();

const {
  getTemplates,
  updateTemplate,
} = require("../controllers/emailTemplate");

router.get("/", getTemplates);
router.put("/:key", updateTemplate);

module.exports = router;