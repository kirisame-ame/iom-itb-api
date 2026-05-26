const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Direktori penyimpanan umum di /app/storage
const storageDir = path.join(__dirname, '../uploads');

// Membuat direktori jika belum ada
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir); // Semua file disimpan di /app/storage
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const getFileExtension = (file) => {
    return path.extname(file.originalname || '').toLowerCase();
};

const fileFilter = (req, file, cb) => {
    const fileExtension = getFileExtension(file);

    if (file.fieldname === 'supportingDocuments' || file.fieldname === 'file') {
        if (file.mimetype === 'application/pdf' && fileExtension === '.pdf') {
            cb(null, true);
        } else {
            cb(new Error('File must be a PDF!'), false);
        }
    } else if (file.fieldname === 'proof') {
        if ((file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png' || 
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'application/pdf') &&
            (fileExtension === '.jpg' ||
            fileExtension === '.jpeg' ||
            fileExtension === '.png' ||
            fileExtension === '.pdf')) {
            cb(null, true);
        } else {
            cb(new Error('File must be an image (jpeg, png, jpg) or a PDF!'), false);
        }
    } else if ((file.mimetype === 'image/jpeg' || 
               file.mimetype === 'image/png' || 
               file.mimetype === 'image/jpg') &&
               (fileExtension === '.jpg' ||
               fileExtension === '.jpeg' ||
               fileExtension === '.png')) {
        cb(null, true);
    } else {
        cb(new Error('File must be an image!'), false);
    }
};

// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batasan ukuran file 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;