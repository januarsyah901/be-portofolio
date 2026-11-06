import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { canWrite, extractBearer, hashApiToken, isApiToken } from '../lib/apiToken';

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

type Access = 'read' | 'write';

/**
 * Builds a middleware that accepts an admin JWT or an API token (`pf_...`).
 * - access "read": any active API token, GET/HEAD requests only.
 * - access "write": only active API tokens with scope "write".
 * Token management and uploads keep `authenticateToken` (JWT only).
 */
function adminOrApiToken(access: Access) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const credential = extractBearer(req.headers['authorization']);

    if (!isApiToken(credential)) {
      return authenticateToken(req, res, next);
    }

    if (access === 'read' && req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(403).json({ message: 'Token API hanya dapat digunakan untuk akses baca (read-only).' });
    }

    try {
      const record = await prisma.apiToken.findUnique({
        where: { tokenHash: hashApiToken(credential) }
      });

      if (!record || record.revokedAt) {
        return res.status(401).json({ message: 'Token API tidak valid atau sudah dicabut.' });
      }

      if (access === 'write' && !canWrite(record.scope)) {
        return res.status(403).json({ message: 'Token API ini hanya memiliki scope read. Buat token dengan scope write untuk mengubah data.' });
      }

      prisma.apiToken
        .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
        .catch((error) => console.error('Failed to update token lastUsedAt:', error));

      return next();
    } catch (error) {
      console.error('Error verifying API token:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  };
}

/** Admin JWT, or any active API token for GET/HEAD. Use on read endpoints only. */
export const authenticateAdminOrReadToken = adminOrApiToken('read');

/** Admin JWT, or an active API token with scope "write". Use on create/update/delete endpoints. */
export const authenticateAdminOrWriteToken = adminOrApiToken('write');
