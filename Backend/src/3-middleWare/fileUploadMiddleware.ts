import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Navigate to the `uploads` folder located in the Backend directory
const uploadDir = path.resolve(__dirname, '../../uploads');

// Print the path to `uploads` folder
console.log('Uploads Directory Path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure `multer`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('UPLOAD DIRECTORY:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        console.log('Generated Filename:', uniqueFilename);
        cb(null, uniqueFilename);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only PDF and image files are allowed.'));
    }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

const upload = multer({ storage, fileFilter, limits });

export const fileUploadMiddleware = (req: any, res: any, next: any) => {
    console.log('Starting file upload...');

    upload.single('file')(req, res, (err: any) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        // Generate the full path to the file on the server (from the root directory)
        const fullFilePath = path.resolve(uploadDir, req.file.filename);
        console.log('File uploaded successfully:', fullFilePath);

        // Attach file data to request object
        req.uploadedFile = {
            filePath: fullFilePath,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        };

        // Pass control to the next middleware/controller
        next();
    });
};
