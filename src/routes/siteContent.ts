import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateAdminOrWriteToken, AuthenticatedRequest } from '../middleware/auth';
import { SITE_CONTENT_KEYS, isSiteContentKey, validateSiteContent } from '../lib/siteContent';

const router = Router();

const serverError = (res: Response, label: string, error: unknown) => {
  console.error(`Error ${label}:`, error);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
};

const unknownKey = (res: Response, key: string) =>
  res.status(404).json({ message: `Section "${key}" tidak dikenal. Pilihan: ${SITE_CONTENT_KEYS.join(', ')}.` });

// GET /api/site-content - Public: every stored section as { key: value }
router.get('/', async (_req, res: Response) => {
  try {
    const rows = await prisma.siteContent.findMany();
    return res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch (error) {
    return serverError(res, 'fetching site content', error);
  }
});

// PUT /api/site-content/:key - Replace one section (body = the section object). Admin JWT or write token.
router.put('/:key', authenticateAdminOrWriteToken, async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  if (!isSiteContentKey(key)) return unknownKey(res, key);

  const result = validateSiteContent(key, req.body);
  if (!result.ok) return res.status(400).json({ message: result.message });

  try {
    const value = result.value as object;
    const row = await prisma.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    return res.json({ key: row.key, value: row.value });
  } catch (error) {
    return serverError(res, 'saving site content', error);
  }
});

// DELETE /api/site-content/:key - Remove a section; the website falls back to its built-in text.
router.delete('/:key', authenticateAdminOrWriteToken, async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  if (!isSiteContentKey(key)) return unknownKey(res, key);

  try {
    await prisma.siteContent.deleteMany({ where: { key } });
    return res.json({ message: `Section "${key}" dihapus. Website memakai teks bawaan.` });
  } catch (error) {
    return serverError(res, 'deleting site content', error);
  }
});

export default router;
