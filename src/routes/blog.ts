import { Router, Response } from 'express';
import supabase from '../supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/blog - Public route to fetch all visible TikTok video entries
router.get('/', async (req, res) => {
  try {
    const { data: videos, error } = await supabase
      .from('BlogVideo')
      .select('*')
      .eq('visible', true)
      .order('order', { ascending: true });

    if (error) throw error;
    return res.json(videos);
  } catch (error) {
    console.error('Error fetching public blog videos:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/admin/blog - Admin route to fetch all blog videos
router.get('/admin-list', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: videos, error } = await supabase
      .from('BlogVideo')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return res.json(videos);
  } catch (error) {
    console.error('Error fetching admin blog videos:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/admin/blog - Create a new blog video
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { videoId, caption, tags, order, visible } = req.body;

  if (!videoId) {
    return res.status(400).json({ message: 'ID Video TikTok wajib diisi.' });
  }

  try {
    const { data: video, error } = await supabase
      .from('BlogVideo')
      .insert({
        videoId,
        caption: caption || '',
        tags: Array.isArray(tags) ? tags : [],
        order: typeof order === 'number' ? order : 0,
        visible: typeof visible === 'boolean' ? visible : true
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(video);
  } catch (error) {
    console.error('Error creating blog video:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// PUT /api/admin/blog/:id - Update an existing blog video
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { videoId, caption, tags, order, visible } = req.body;

  try {
    const videoIdNum = parseInt(id);
    if (isNaN(videoIdNum)) {
      return res.status(400).json({ message: 'ID entry tidak valid.' });
    }

    const { data: existingVideo, error: findError } = await supabase
      .from('BlogVideo')
      .select('*')
      .eq('id', videoIdNum)
      .single();

    if (findError || !existingVideo) {
      return res.status(404).json({ message: 'Entry video tidak ditemukan.' });
    }

    const { data: updatedVideo, error: updateError } = await supabase
      .from('BlogVideo')
      .update({
        videoId: videoId !== undefined ? videoId : existingVideo.videoId,
        caption: caption !== undefined ? caption : existingVideo.caption,
        tags: Array.isArray(tags) ? tags : existingVideo.tags,
        order: typeof order === 'number' ? order : existingVideo.order,
        visible: typeof visible === 'boolean' ? visible : existingVideo.visible
      })
      .eq('id', videoIdNum)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json(updatedVideo);
  } catch (error) {
    console.error('Error updating blog video:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// DELETE /api/admin/blog/:id - Delete a blog video
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const videoIdNum = parseInt(id);
    if (isNaN(videoIdNum)) {
      return res.status(400).json({ message: 'ID entry tidak valid.' });
    }

    const { data: existingVideo, error: findError } = await supabase
      .from('BlogVideo')
      .select('*')
      .eq('id', videoIdNum)
      .single();

    if (findError || !existingVideo) {
      return res.status(404).json({ message: 'Entry video tidak ditemukan.' });
    }

    const { error: deleteError } = await supabase
      .from('BlogVideo')
      .delete()
      .eq('id', videoIdNum);

    if (deleteError) throw deleteError;

    return res.json({ message: 'Entry video berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting blog video:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
