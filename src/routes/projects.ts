import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/projects - Public route to fetch all visible projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' }
    });
    return res.json(projects);
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/admin/projects - Admin route to fetch all projects (with visibility filter bypass)
router.get('/admin-list', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    });
    return res.json(projects);
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/admin/projects - Create a new project
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, imageUrl, liveUrl, githubUrl, tags, order, visible } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Judul dan deskripsi proyek wajib diisi.' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        tags: Array.isArray(tags) ? tags : [],
        order: typeof order === 'number' ? order : 0,
        visible: typeof visible === 'boolean' ? visible : true
      }
    });
    return res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// PUT /api/projects/reorder - Reorder projects (bulk update)
router.put('/reorder', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { orderedIds } = req.body;
  
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: 'orderedIds harus berupa array dari ID proyek.' });
  }

  try {
    // Perform bulk updates in a transaction
    await prisma.$transaction(
      orderedIds.map((id: number, index: number) =>
        prisma.project.update({
          where: { id: Number(id) },
          data: { order: index + 1 }
        })
      )
    );
    return res.json({ message: 'Urutan proyek berhasil diperbarui.' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// PUT /api/admin/projects/:id - Update an existing project
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, imageUrl, liveUrl, githubUrl, tags, order, visible } = req.body;

  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID proyek tidak valid.' });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: title !== undefined ? title : existingProject.title,
        description: description !== undefined ? description : existingProject.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
        liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        tags: Array.isArray(tags) ? tags : existingProject.tags,
        order: typeof order === 'number' ? order : existingProject.order,
        visible: typeof visible === 'boolean' ? visible : existingProject.visible
      }
    });

    return res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// DELETE /api/admin/projects/:id - Delete a project
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID proyek tidak valid.' });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return res.json({ message: 'Proyek berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
