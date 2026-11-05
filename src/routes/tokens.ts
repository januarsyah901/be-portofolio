import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { MAX_ACTIVE_TOKENS, generateApiToken, normalizeTokenName } from '../lib/apiToken';

const router = Router();

// Managing tokens requires an admin JWT; API tokens can never manage tokens.
router.use(authenticateToken);

const publicFields = {
  id: true,
  name: true,
  prefix: true,
  createdAt: true,
  lastUsedAt: true,
  revokedAt: true
} as const;

// GET /api/admin/tokens - List tokens (never returns the secret or its hash)
router.get('/', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const tokens = await prisma.apiToken.findMany({
      select: publicFields,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(tokens);
  } catch (error) {
    console.error('Error listing API tokens:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/admin/tokens - Create a token; the plaintext is returned only once
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const name = normalizeTokenName(req.body?.name);
  if (!name) {
    return res.status(400).json({ message: 'Nama token wajib diisi (1-60 karakter).' });
  }

  try {
    const activeCount = await prisma.apiToken.count({ where: { revokedAt: null } });
    if (activeCount >= MAX_ACTIVE_TOKENS) {
      return res.status(400).json({
        message: `Maksimal ${MAX_ACTIVE_TOKENS} token aktif. Cabut token lama terlebih dahulu.`
      });
    }

    const { token, hash, prefix } = generateApiToken();
    const record = await prisma.apiToken.create({
      data: { name, tokenHash: hash, prefix },
      select: publicFields
    });

    return res.status(201).json({ ...record, token });
  } catch (error) {
    console.error('Error creating API token:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// DELETE /api/admin/tokens/:id - Revoke a token
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'ID token tidak valid.' });
  }

  try {
    const result = await prisma.apiToken.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt: new Date() }
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'Token tidak ditemukan atau sudah dicabut.' });
    }

    return res.json({ message: 'Token berhasil dicabut.' });
  } catch (error) {
    console.error('Error revoking API token:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
