import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import testimonialRoutes from './routes/testimonials';
import blogRoutes from './routes/blog';
import orgExperienceRoutes from './routes/orgExperience';
import siteContentRoutes from './routes/siteContent';
import uploadRoutes from './routes/upload';
import tokenRoutes from './routes/tokens';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local backend public directory uploads statically
app.use('/assets/uploads', express.static(path.join(__dirname, '../public/assets/uploads')));
app.use('/cv.pdf', express.static(path.join(__dirname, '../public/cv.pdf')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/org-experience', orgExperienceRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/tokens', tokenRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server portfolio berjalan dengan baik.' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

