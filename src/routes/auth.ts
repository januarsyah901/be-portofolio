import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    const user = await prisma.adminUser.findFirst({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/auth/me (Check token validity)
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

const ALLOWED_EMAILS = [
  'januarsyahakbar791@gmail.com',
  'januarsyahakbar282@gmail.com'
];

// POST /api/auth/google-verify
router.post('/google-verify', async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'Access token Google wajib disertakan.' });
  }

  try {
    // Verify Google access token via Google's userinfo endpoint
    const googleResp = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );

    if (!googleResp.ok) {
      return res.status(401).json({ message: 'Token Google tidak valid atau kedaluwarsa.' });
    }

    const googleUser = await googleResp.json() as { email?: string; name?: string };

    const email = googleUser.email;
    if (!email || !ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ message: `Akses ditolak. Email ${email || ''} tidak memiliki izin admin.` });
    }

    // Check if the user exists in AdminUser table
    let adminUser = await prisma.adminUser.findFirst({
      where: { username: email }
    });

    // If not exists, auto-create a user record
    if (!adminUser) {
      const dummyPasswordHash = await bcrypt.hash(Math.random().toString(36), 10);
      adminUser = await prisma.adminUser.create({
        data: {
          username: email,
          passwordHash: dummyPasswordHash
        }
      });
    }

    // Generate JWT token using user's db row id
    const token = jwt.sign({ userId: adminUser.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username
      }
    });
  } catch (err) {
    console.error('Error during Google verification:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
