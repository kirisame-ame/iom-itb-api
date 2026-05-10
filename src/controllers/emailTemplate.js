const { EmailTemplate } = require("../models");

const getTemplates = async (req, res) => {
  try {
    console.log("MODEL:", EmailTemplate);

    const templates = await EmailTemplate.findAll({
      order: [["id", "ASC"]],
    });

    console.log("DATA:", templates);

    return res.json(templates);
  } catch (error) {
    console.error("ERROR TEMPLATE:");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { key } = req.params;
    const { subject, body } = req.body;

    console.log("UPDATE BODY:", req.body);

    const template = await EmailTemplate.findOne({
      where: { key },
    });

    if (!template) {
      return res.status(404).json({
        message: "Template tidak ditemukan",
      });
    }

    await template.update({
      subject,
      body,
    });

    return res.json({
      message: "Template berhasil diupdate",
      data: template,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getTemplates,
  updateTemplate,
};