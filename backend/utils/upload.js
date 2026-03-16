/**
 * Multer configuration for album image uploads.
 * Extracted from albumRoutes so routes stay lean.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename(_req, file, cb) {
    const uniqueName = `album-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const extOk = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED_TYPES.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

module.exports = { upload };
