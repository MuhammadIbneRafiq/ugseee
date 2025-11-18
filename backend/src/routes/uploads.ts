import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase';
import { validateAuthToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, audio, and video files
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg|mp4|mov|avi/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Upload image for video
router.post('/image/:videoId', validateAuthToken, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user?.id;
    const videoId = req.params.videoId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Verify video belongs to user
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();

    if (videoError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const filePath = `${userId}/${videoId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploaded-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        duplex: 'half',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploaded-images')
      .getPublicUrl(filePath);

    // Save asset record
    const { data: asset, error: assetError } = await supabase
      .from('video_assets')
      .insert([{
        video_id: videoId,
        asset_type: 'image',
        file_name: fileName,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        metadata: {
          original_name: file.originalname,
        },
      }])
      .select()
      .single();

    if (assetError) throw assetError;

    res.json(asset);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload audio for video
router.post('/audio/:videoId', validateAuthToken, upload.single('audio'), async (req, res) => {
  try {
    const userId = req.user?.id;
    const videoId = req.params.videoId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Verify video belongs to user
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();

    if (videoError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const filePath = `${userId}/${videoId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('temp-assets')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        duplex: 'half',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('temp-assets')
      .getPublicUrl(filePath);

    // Save asset record
    const { data: asset, error: assetError } = await supabase
      .from('video_assets')
      .insert([{
        video_id: videoId,
        asset_type: 'audio',
        file_name: fileName,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        metadata: {
          original_name: file.originalname,
        },
      }])
      .select()
      .single();

    if (assetError) throw assetError;

    res.json(asset);
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

// Upload avatar
router.post('/avatar', validateAuthToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileName = `${userId}.${file.originalname.split('.').pop()}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Replace existing avatar
        duplex: 'half',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('user_id', userId);

    if (profileError) throw profileError;

    res.json({ avatar_url: urlData.publicUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

export default router;