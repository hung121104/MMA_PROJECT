# Stripe Payment Integration for React Native

This project includes a complete Stripe payment integration for React Native using `@stripe/stripe-react-native`.

## Files Created

1. **`components/PaymentComponent.js`** - Main payment component
2. **`components/StripeProvider.js`** - Stripe provider wrapper
3. **`screens/PaymentScreen.js`** - Example payment screen
4. **`config/stripe.js`** - Configuration and environment variables

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @stripe/stripe-react-native
```

### 2. Configure Stripe Keys
Update `config/stripe.js` with your Stripe publishable key:
```javascript
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
```

### 3. Backend API Endpoint
Your backend should expose:
```
POST /order/payments
{
  "orderId": "order_123",
  "totalAmount": 2500, // in cents
  "currency": "usd"
}
```

Response:
```json
{
  "client_secret": "pi_xxx_secret_xxx"
}
```

### 4. Usage Example

```javascript
import PaymentComponent from './components/PaymentComponent';
import StripeProviderWrapper from './components/StripeProvider';

// In your component:
<StripeProviderWrapper publishableKey="pk_test_xxx">
  <PaymentComponent
    orderId="order_123"
    totalAmount={2500} // $25.00 in cents
    currency="usd"
    onPaymentSuccess={(paymentIntent) => {
      console.log('Payment successful:', paymentIntent);
    }}
    onPaymentError={(error) => {
      console.error('Payment failed:', error);
    }}
    apiBaseUrl="http://your-backend-url.com"
  />
</StripeProviderWrapper>
```

## Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Any future expiry date**
- **Any 3-digit CVC**

## Features
- ✅ Secure card input with Stripe CardField
- ✅ Real-time validation
- ✅ Loading states and error handling
- ✅ Success/error callbacks
- ✅ Clean, responsive UI
- ✅ Test mode support 