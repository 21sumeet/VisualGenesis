import Stripe from 'stripe';

export const StripeInstance = new Stripe(process.env.STRIPE_API_KEY!);
