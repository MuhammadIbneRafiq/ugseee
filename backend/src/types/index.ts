export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  referral_source: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  credits_included: number;
  max_videos: number | null;
  features: string[];
  mollie_price_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  credits_remaining: number;
  credits_total: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  current_period_start: string | null;
  current_period_end: string | null;
  mollie_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  script: string | null;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  is_public: boolean;
  category_id: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number | null;
  settings: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VideoAsset {
  id: string;
  video_id: string;
  asset_type: 'image' | 'audio' | 'thumbnail' | 'final_video';
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  mollie_payment_id: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed' | 'expired';
  description: string | null;
  credits_purchased: number;
  subscription_id: string | null;
  created_at: string;
  updated_at: string;
}