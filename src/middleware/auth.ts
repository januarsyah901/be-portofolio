import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { extractBearer, hashApiToken, isApiToken } from '../lib/apiToken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
}

/**
 * Accepts an admin JWT, or a read-only API token (`pf_...`) for GET/HEAD
 * requests. Use on read endpoints only; write routes must keep
 * `authenticateToken` so API tokens can never modify data.
 */
export async function authenticateAdminOrReadToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const credential = extractBearer(req.headers['authorization']);

  if (!isApiToken(credential)) {
    return authenticateToken(req, res, next);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(403).json({ message: 'Token API hanya dapat digunakan untuk akses baca (read-only).' });
  }

  try {
    const record = await prisma.apiToken.findUnique({
      where: { tokenHash: hashApiToken(credential) }
    });

    if (!record || record.revokedAt) {
      return res.status(401).json({ message: 'Token API tidak valid atau sudah dicabut.' });
    }

    prisma.apiToken
      .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
      .catch((error) => console.error('Failed to update token lastUsedAt:', error));

    return next();
  } catch (error) {
    console.error('Error verifying API token:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}
