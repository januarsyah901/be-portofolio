import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Ensure uploads directory exists in local backend public folder
const publicDir = path.join(__dirname, '../../public');
const uploadsDir = path.join(publicDir, 'assets/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration for general image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar (.jpg, .jpeg, .png, .gif, .webp) yang diperbolehkan.'));
  }
});

// POST /api/admin/upload/image - Upload project or testimonial image
router.post('/image', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
    }
    
    // Relative path that Vite can serve from public folder
    const relativePath = `/assets/uploads/${req.file.filename}`;
    return res.json({ url: relativePath });
  });
});

// Multer storage for CV (always saves as cv.pdf in public folder)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'cv.pdf');
  }
});

const uploadCv = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase() === '.pdf';
    
    if (extname && file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    cb(new Error('Hanya file PDF yang diperbolehkan untuk CV.'));
  }
});

// POST /api/admin/upload/cv - Upload/update CV PDF
router.post('/cv', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  uploadCv.single('cv')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file CV yang diunggah.' });
    }
    
    return res.json({ url: '/cv.pdf', message: 'CV berhasil diperbarui.' });
  });
});

export default router;
