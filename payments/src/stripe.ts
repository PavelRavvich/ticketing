import Stripe from 'stripe';

export const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});
