const axios  = require('axios');
const crypto = require('crypto');

const BASE_URL  = process.env.CHARGILY_BASE_URL  || 'https://pay.chargily.net/api/v2';
const API_KEY   = process.env.CHARGILY_API_KEY   || '';
const SECRET    = process.env.CHARGILY_SECRET_KEY || '';
const APP_URL   = process.env.APP_BASE_URL        || 'http://localhost';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization:  `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Create a Chargily Pay v2 checkout session.
 * @returns {{ checkoutId, checkoutUrl }}
 */
const createCheckout = async ({ orderId, amount, clientName, clientEmail }) => {
  const body = {
    amount:           Math.round(amount * 100), // Chargily uses centimes
    currency:         'dzd',
    success_url:      `${APP_URL}/payment/success?order=${orderId}`,
    failure_url:      `${APP_URL}/payment/failure?order=${orderId}`,
    webhook_endpoint: `${APP_URL}/api/payment/webhook`,
    description:      `Commande #${orderId.slice(0, 8)}`,
    metadata:         { orderId },
    customer: {
      name:  clientName  || 'Client',
      email: clientEmail || '',
    },
  };

  const { data } = await client.post('/checkouts', body);
  return {
    checkoutId:  data.id,
    checkoutUrl: data.checkout_url,
  };
};

/**
 * Verify the HMAC SHA-256 signature sent by Chargily on the webhook.
 * Chargily signs the raw request body with the secret key.
 */
const verifyWebhookSignature = (rawBody, signature) => {
  if (!SECRET) return true; // skip in dev if secret not set
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
};

/**
 * Fetch a checkout's current status from Chargily.
 */
const getCheckout = async (checkoutId) => {
  const { data } = await client.get(`/checkouts/${checkoutId}`);
  return data;
};

module.exports = { createCheckout, verifyWebhookSignature, getCheckout };