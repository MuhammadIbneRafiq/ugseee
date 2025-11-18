import express from 'express';
import { supabase } from '../config/supabase';
import { validateAuthToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get user's videos
router.get('/', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        categories(*),
        video_assets(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get public videos for ForYou page
router.get('/public', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        categories(*),
        profiles!videos_user_id_fkey(first_name, last_name, avatar_url)
      `)
      .eq('is_public', true)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching public videos:', error);
    res.status(500).json({ error: 'Failed to fetch public videos' });
  }
});

// Create new video
router.post('/', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, script, category_id, settings } = req.body;

    // Check if user has credits
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('credits_remaining')
      .eq('user_id', userId)
      .single();

    if (!subscription || subscription.credits_remaining <= 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Create video
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        user_id: userId,
        title,
        script,
        category_id,
        settings,
        status: 'draft',
      }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Generate video (consume credit and start processing)
router.post('/:id/generate', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const videoId = req.params.id;

    // Consume credit
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('credits_remaining')
      .eq('user_id', userId)
      .single();

    if (!subscription || subscription.credits_remaining <= 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Update credits
    await supabase
      .from('user_subscriptions')
      .update({ credits_remaining: subscription.credits_remaining - 1 })
      .eq('user_id', userId);

    // Update video status
    const { data, error } = await supabase
      .from('videos')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // TODO: Trigger actual video generation process
    // For now, simulate completion after 30 seconds
    setTimeout(async () => {
      await supabase
        .from('videos')
        .update({ 
          status: 'completed',
          video_url: `https://example.com/videos/${videoId}.mp4`,
          thumbnail_url: `https://example.com/thumbnails/${videoId}.jpg`,
          duration: 30,
          updated_at: new Date().toISOString()
        })
        .eq('id', videoId);
    }, 30000);

    res.json({ message: 'Video generation started', video: data });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

// Toggle video privacy
router.patch('/:id/privacy', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const videoId = req.params.id;
    const { is_public } = req.body;

    const { data, error } = await supabase
      .from('videos')
      .update({ 
        is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating video privacy:', error);
    res.status(500).json({ error: 'Failed to update video privacy' });
  }
});

// Delete video
router.delete('/:id', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const videoId = req.params.id;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;