# How to test payments in dev environment

### Make sure use Stripe test credentials

.env file:

STRIPE_SECRET=sk_test_...
STRIPE_PUBLISHABLE=pk_test_...

### Test instruction:

https://stripe.com/docs/testing

### Use fake credit card number for transaction

For instance:

- Card Type: Visa
- Card No: 4242 4242 4242 4242
- Exp. date: any date in future
- CVC: any 3 digits

