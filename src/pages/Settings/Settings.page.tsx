import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Elements, StripeProvider } from 'react-stripe-elements';
import BillingForm from '../../components/FormBilling/Billing.form';
import { onError } from '../../libs/errorLib';
import config from '../../config';
import './Settings.page.css';

export interface Bill { storage: string; source: string }

export default function Settings() {
  const history = useHistory();
  const [stripe, setStripe] = useState<stripe.Stripe>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  function billUser(details: Bill) {
    return API.post('notes', '/billing', {
      body: details
    });
  }

  async function handleFormSubmit(storage: string, { token, error }: any) {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({ storage, source: token.id });
      // alert('Your card has been charged successfully!');
      history.push('/');

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  if (!stripe) return null;


  return <div className="Settings">
    <StripeProvider stripe={stripe!}>
      <Elements
        fonts={[{
          cssSrc: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'
        }]}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </StripeProvider>
  </div>;
}
