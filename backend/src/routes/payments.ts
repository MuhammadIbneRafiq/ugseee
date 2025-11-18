import express from 'express';
import { mollieClient, MOLLIE_CONFIG } from '../config/mollie';
import { supabase } from '../config/supabase';
import { validateAuthToken } from '../middleware/auth';

const router = express.Router();

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_cents');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create payment for plan
router.post('/create-payment', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { plan_id } = req.body;

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: (plan.price_cents / 100).toFixed(2),
      },
      description: `${plan.name} Plan - MotionMaker`,
      redirectUrl: `${MOLLIE_CONFIG.redirectUrl}/dashboard`,
      webhookUrl: MOLLIE_CONFIG.webhookUrl,
      metadata: {
        user_id: userId,
        plan_id: plan_id,
      },
    });

    // Save payment transaction
    await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
        mollie_payment_id: payment.id,
        amount_cents: plan.price_cents,
        currency: 'EUR',
        status: 'pending',
        description: `${plan.name} Plan Purchase`,
        credits_purchased: plan.credits_included,
      }]);

    res.json({
      payment_url: payment.getCheckoutUrl(),
      payment_id: payment.id,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Buy additional credits
router.post('/buy-credits', validateAuthToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { credits } = req.body;

    const pricePerCredit = 50; // 50 cents per credit
    const totalAmount = credits * pricePerCredit;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: (totalAmount / 100).toFixed(2),
      },
      description: `${credits} Credits - MotionMaker`,
      redirectUrl: `${MOLLIE_CONFIG.redirectUrl}/dashboard`,
      webhookUrl: MOLLIE_CONFIG.webhookUrl,
      metadata: {
        user_id: userId,
        credits: credits.toString(),
        type: 'credits',
      },
    });

    // Save payment transaction
    await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
        mollie_payment_id: payment.id,
        amount_cents: totalAmount,
        currency: 'EUR',
        status: 'pending',
        description: `${credits} Credits Purchase`,
        credits_purchased: credits,
      }]);

    res.json({
      payment_url: payment.getCheckoutUrl(),
      payment_id: payment.id,
    });
  } catch (error) {
    console.error('Error buying credits:', error);
    res.status(500).json({ error: 'Failed to buy credits' });
  }
});

// Mollie webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const paymentId = req.body.id;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'No payment ID provided' });
    }

    // Get payment from Mollie
    const payment = await mollieClient.payments.get(paymentId);
    
    // Update our database
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('mollie_payment_id', paymentId)
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', paymentId);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction status
    await supabase
      .from('payment_transactions')
      .update({ 
        status: payment.status,
        updated_at: new Date().toISOString()
      })
      .eq('mollie_payment_id', paymentId);

    if (payment.status === 'paid') {
      // Add credits to user account
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('credits_remaining')
        .eq('user_id', transaction.user_id)
        .single();

      if (subscription) {
        await supabase
          .from('user_subscriptions')
          .update({
            credits_remaining: subscription.credits_remaining + transaction.credits_purchased,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', transaction.user_id);
      }

      // If it's a plan purchase, update subscription
      if (payment.metadata.plan_id) {
        await supabase
          .from('user_subscriptions')
          .update({
            plan_id: payment.metadata.plan_id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            updated_at: new Date().toISOString()
          })
          .eq('user_id', transaction.user_id);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;