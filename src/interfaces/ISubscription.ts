import IPayment from './IPayment';

export interface ISubscriptionInfo {
  alert_id?: string;
  alert_name?: string;
  checkout_id?: string;
  currency?: string;
  event_time?: string;
  next_bill_date?: string;
  status?: string;
  user_id?: string;
  cancel_url?: string;
  source?: string;
  unit_price?: string;
  update_url?: string;

  balance_currency?: string;
  balance_earnings?: string;
  balance_fee?: string;
  balance_gross?: string;
  balance_tax?: string;
  coupon?: string;
  customer_name?: string;
  earnings?: string;
  fee?: string;
  initial_payment?: string;
  next_payment_amount?: string;
  order_id?: string;
  payment_method?: string;
  payment_tax?: string;
  receipt_url?: string;
  sale_gross?: string;
}

interface ISubscription {
  subscriptionId: number;
  status: string;
  planId: number;
  serviceUserId: number;
  serviceSubscriptionId: number;
  updateUrl: string;
  cancelUrl: string;
  info: ISubscriptionInfo;
  nextBillDate: Date;
  createdAt: Date;
  payments: IPayment[];
}

export default ISubscription;
