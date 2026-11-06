import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateAdminOrReadToken, authenticateAdminOrWriteToken, AuthenticatedRequest } from '../middleware/auth';
import { parseOrgExperienceInput } from '../lib/orgExperience';

const router = Router();

const ordering = [{ order: 'asc' as const }, { id: 'asc' as const }];
const serverError = (res: Response, label: string, error: unknown) => {
  console.error(`Error ${label}:`, error);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
};

// GET /api/org-experience - Public: visible organization/event entries
router.get('/', async (_req, res: Response) => {
  try {
    return res.json(await prisma.orgExperience.findMany({ where: { visible: true }, orderBy: ordering }));
  } catch (error) {
    return serverError(res, 'fetching public org experience', error);
  }
});

// GET /api/org-experience/admin-list - All entries, including hidden (admin JWT or any API token)
router.get('/admin-list', authenticateAdminOrReadToken, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json(await prisma.orgExperience.findMany({ orderBy: ordering }));
  } catch (error) {
    return serverError(res, 'fetching admin org experience', error);
  }
});

// POST /api/org-experience - Create (admin JWT or write-scoped API token)
router.post('/', authenticateAdminOrWriteToken, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = parseOrgExperienceInput(req.body, 'create');
  if (!parsed.ok) return res.status(400).json({ message: parsed.message });

  try {
    const created = await prisma.orgExperience.create({
      data: parsed.data as Parameters<typeof prisma.orgExperience.create>[0]['data']
    });
    return res.status(201).json(created);
  } catch (error) {
    return serverError(res, 'creating org experience', error);
  }
});

// PUT /api/org-experience/:id - Partial update
router.put('/:id', authenticateAdminOrWriteToken, async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'ID tidak valid.' });

  const parsed = parseOrgExperienceInput(req.body, 'update');
  if (!parsed.ok) return res.status(400).json({ message: parsed.message });

  try {
    const existing = await prisma.orgExperience.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Entri organisasi/event tidak ditemukan.' });

    return res.json(await prisma.orgExperience.update({ where: { id }, data: parsed.data }));
  } catch (error) {
    return serverError(res, 'updating org experience', error);
  }
});

// DELETE /api/org-experience/:id - Permanent delete
router.delete('/:id', authenticateAdminOrWriteToken, async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'ID tidak valid.' });

  try {
    const existing = await prisma.orgExperience.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Entri organisasi/event tidak ditemukan.' });

    await prisma.orgExperience.delete({ where: { id } });
    return res.json({ message: 'Entri organisasi/event berhasil dihapus.' });
  } catch (error) {
    return serverError(res, 'deleting org experience', error);
  }
});

export default router;
