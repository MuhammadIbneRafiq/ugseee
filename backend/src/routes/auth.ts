import express from 'express';
import { supabase } from '../config/supabase';
import { validateAuthToken } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', userId)
      .single();

    if (subError) throw subError;

    res.json({
      profile,
      subscription,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, organization, referral_source } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        organization,
        referral_source,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;