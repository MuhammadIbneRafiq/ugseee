import { createMollieClient } from '@mollie/api-client';

const mollieApiKey = process.env.MOLLIE_API_KEY || '';

export const mollieClient = createMollieClient({
  apiKey: mollieApiKey,
});

export const MOLLIE_CONFIG = {
  webhookUrl: process.env.MOLLIE_WEBHOOK_URL || 'http://localhost:3001/api/payments/webhook',
  redirectUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};