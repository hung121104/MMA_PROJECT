import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

/**
 * StripeProviderWrapper - Wraps your app with Stripe configuration
 * 
 * @param {string} publishableKey - Your Stripe publishable key
 * @param {React.ReactNode} children - Child components that need Stripe functionality
 */
const StripeProviderWrapper = ({ publishableKey, children }) => {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.yourcompany.yourapp" // Optional: for Apple Pay
    >
      {children}
    </StripeProvider>
  );
};

export default StripeProviderWrapper; 