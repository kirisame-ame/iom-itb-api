const fs = require('fs');
const path = require('path');

const uploadDir = path.resolve(__dirname, '../../uploads');

const pickImageFile = (files) => files?.image?.[0] || null;

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
};

const moveUploadedFile = (file, baseUrl) => {
  ensureUploadDir();
  const dest = path.join(uploadDir, file.filename);
  if (file.path !== dest) fs.renameSync(file.path, dest);
  file.storedPath = dest;
  return `${baseUrl}/uploads/${file.filename}`;
};

const cleanupUploadedFiles = (...files) => {
  files
    .filter(Boolean)
    .map((file) => file.storedPath || file.path)
    .filter((filePath) => fs.existsSync(filePath))
    .forEach((filePath) => fs.unlinkSync(filePath));
};

module.exports = {
  pickImageFile,
  moveUploadedFile,
  cleanupUploadedFiles,
};
