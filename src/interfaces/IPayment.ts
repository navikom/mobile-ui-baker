interface IPaymentInfo {
  subscription_id?: number;
  service_subscription_id?: string;
  receipt_url?: string;
  checkout_id?: string;
  balance_currency?: string;
  balance_earnings?: string;
  balance_fee?: string;
  balance_gross?: string;
  balance_tax?: string;
  country?: string;
  coupon?: string;
  customer_name?: string;
  earnings?: string;
  currency?: string;
  email?: string;
  event_time?: string;
  fee?: string;
  initial_payment?: string;
  instalments?: string;
  order_id?: string;
  payment_method?: string;
  payment_tax?: string;
  plan_name?: string;
  quantity?: string;
  sale_gross?: string;
  subscription_payment_id?: string;
  unit_price?: string;
}

interface IPayment {
  paymentId: number;
  userId: number;
  title?: string;
  serviceRef?: string;
  info: IPaymentInfo;
  payment: number;
  createdAt: Date;
}

export default IPayment;
