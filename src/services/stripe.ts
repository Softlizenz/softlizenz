import Stripe from 'stripe';

const STRIPE_API_KEY = process.env.STRIPE_API_KEY;

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY || '',
  {
    apiVersion: '2025-05-28.basil',
  }
);

