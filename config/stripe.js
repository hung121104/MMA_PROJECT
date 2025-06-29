/**
 * Stripe Configuration
 * 
 * This file contains all Stripe-related configuration and environment variables.
 * Make sure to replace the placeholder values with your actual Stripe keys.
 */

// Stripe Publishable Key (public key - safe to use in frontend)
// Get this from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

// Backend API Configuration
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Payment Configuration
export const DEFAULT_CURRENCY = 'usd';
export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'cad'];

// Apple Pay Configuration (optional)
export const MERCHANT_IDENTIFIER = 'merchant.com.yourcompany.yourapp';

// Test Card Numbers for Development
export const TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINED: '4000000000000002',
  REQUIRES_AUTHENTICATION: '4000002500003155',
  REQUIRES_ACTION: '4000008400001629',
};

// Environment Detection
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Validation function for Stripe key
export const validateStripeKey = () => {
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === 'pk_test_your_publishable_key_here') {
    console.warn('⚠️  Please set your Stripe publishable key in the environment variables or config/stripe.js');
    return false;
  }
  return true;
};

// Get the appropriate API URL based on environment
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT_INTENT: '/order/payments',
  CONFIRM_PAYMENT: '/order/payments/confirm',
  GET_PAYMENT_STATUS: '/order/payments/status',
}; 