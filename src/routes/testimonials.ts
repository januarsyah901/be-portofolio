import { Router, Response } from 'express';
import supabase from '../supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/testimonials - Public route to fetch all visible testimonials
router.get('/', async (req, res) => {
  try {
    const { data: testimonials, error } = await supabase
      .from('Testimonial')
      .select('*')
      .eq('visible', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/admin/testimonials - Admin route to fetch all testimonials
router.get('/admin-list', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: testimonials, error } = await supabase
      .from('Testimonial')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/admin/testimonials - Create a new testimonial
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, role, company, avatarUrl, text, rating, visible } = req.body;

  if (!name || !role || !text) {
    return res.status(400).json({ message: 'Nama, peran (role), dan pesan testimonial wajib diisi.' });
  }

  try {
    const { data: testimonial, error } = await supabase
      .from('Testimonial')
      .insert({
        name,
        role,
        company,
        avatarUrl,
        text,
        rating: typeof rating === 'number' ? rating : 5,
        visible: typeof visible === 'boolean' ? visible : true
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// PUT /api/admin/testimonials/:id - Update an existing testimonial
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, company, avatarUrl, text, rating, visible } = req.body;

  try {
    const testimonialId = parseInt(id);
    if (isNaN(testimonialId)) {
      return res.status(400).json({ message: 'ID testimonial tidak valid.' });
    }

    const { data: existingTestimonial, error: findError } = await supabase
      .from('Testimonial')
      .select('*')
      .eq('id', testimonialId)
      .single();

    if (findError || !existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial tidak ditemukan.' });
    }

    const { data: updatedTestimonial, error: updateError } = await supabase
      .from('Testimonial')
      .update({
        name: name !== undefined ? name : existingTestimonial.name,
        role: role !== undefined ? role : existingTestimonial.role,
        company: company !== undefined ? company : existingTestimonial.company,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existingTestimonial.avatarUrl,
        text: text !== undefined ? text : existingTestimonial.text,
        rating: typeof rating === 'number' ? rating : existingTestimonial.rating,
        visible: typeof visible === 'boolean' ? visible : existingTestimonial.visible
      })
      .eq('id', testimonialId)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// DELETE /api/admin/testimonials/:id - Delete a testimonial
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const testimonialId = parseInt(id);
    if (isNaN(testimonialId)) {
      return res.status(400).json({ message: 'ID testimonial tidak valid.' });
    }

    const { data: existingTestimonial, error: findError } = await supabase
      .from('Testimonial')
      .select('*')
      .eq('id', testimonialId)
      .single();

    if (findError || !existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial tidak ditemukan.' });
    }

    const { error: deleteError } = await supabase
      .from('Testimonial')
      .delete()
      .eq('id', testimonialId);

    if (deleteError) throw deleteError;

    return res.json({ message: 'Testimonial berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
