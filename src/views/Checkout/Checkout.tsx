import React from 'react';
import CheckoutStore from 'views/Checkout/CheckoutStore';

interface CheckoutFormProps {
  store: CheckoutStore;

}

const CheckoutDetails: React.FC<CheckoutFormProps> = ({ store }) => {
  return (
    <div></div>
  )
};

interface CheckoutProps {
  code: string;
  handleCheckout: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ code, ...rest }) => {
  const store = new CheckoutStore(code);
  React.useEffect(() => {

    return () => {
      store.dispose();
    }
  }, [store]);

  return (
    <CheckoutDetails store={store} />
  )
};

export default Checkout;
