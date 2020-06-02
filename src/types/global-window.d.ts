import { App } from '../models/App';

declare interface IDuration {
  unit: string;
  length: number;
}

declare interface IToCoProduct {
  code?: string;
  name?: string;
  type?: string;
  quantity: number;
  price?: number;
  externalReference?: string;
  duration?: IDuration;
  options?: { [key: string]: any}[];
}

declare interface IToCoProducts {
  add(product: IToCoProduct): void;
  removeAll(): void;
  getAll(): IToCoProduct[];
}

declare interface IToSetup {
  setMerchant(merchant: string): void;
  setMode(mode: string): void;
  setConfig(key: string, value: string): void;
}

declare interface IToCoBilling {
  setData(data: string): void;
  setName(name: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  setCountry(country: string): void;
  setCity(city: string): void;
  setState(state: string): void;
  setZip(zip: string): void;
  setAddress(address: string): void;
  setAddress2(address: string): void;
  reset(): void;
}

declare interface IToShipping {
  setName(name: string): void;
  setEmail(email: string): void;
}

declare interface IToCoCart {
  checkout(): void;
  test: boolean;
  coupon: string;
  token: string;
  expiration: string;

  register(): void;
  addCoupon(coupon: string): void;
  addCoupons(coupons: string[]): void;
  removeCoupon(coupon: string): void;
  removeCoupons(): void;
  setReturnMethod({url: string, type: string}): void;
  setTest(value: boolean): void;
  setLoaderState(): void;
  setIframeState(): void;
  reloadCart(): void;
  setReset(value: boolean): void;
  setOrderExternalRef(ref: string): void;
  setExternalCustomerReference(ref: string): void;
  setCurrency(currency: string): void;
}

declare interface IToCoEvents {
  subscribe(eventName: string, callback: (payload?: any) => void): void;
  unsubscribe(eventName: string, callback: void): void;
}

declare interface ITwoCoInlineCart {
  products: IToCoProducts;
  cart: IToCoCart;
  billing: IToCoBilling;
  setup: IToSetup;
  shipping: IToShipping;
  events: IToCoEvents;
  register(): void;
}

declare interface ICallback {
  "checkout": {
    "completed": boolean;
    "id": string;
    "coupon": string | null;
    "prices": {
      "customer": {
        "currency": string;
        "unit": string;
        "total": string;
      };
      "vendor": {
        "currency": string;
        "unit": string;
        "total": string;
      };
    };
    "passthrough": string | null;
    "redirect_url": string | null;
  };
  "product": {
    "quantity": number;
    "id": string;
    "name": string;
  };
  "user": {
    "country": string;
    "email": string;
    "id": string;
  };
}

declare interface ICheckoutParams {
  product?: string;
  email?: string;
  passthrough?: string;
  coupon?: string;
  override?: string;
  successCallback?: (data: ICallback) => void;
  closeCallback?: (data: ICallback) => void;
}

declare interface ICheckout {
  open: (settings: ICheckoutParams) => void;
}

declare interface IPaddle {
  Setup: (settings: {[key: string]: (string | number)}) => void;
  Checkout: ICheckout;
}

declare global {
  interface Window {
    TwoCoInlineCart: ITwoCoInlineCart;
    Paddle: IPaddle;
  }
}

window.TwoCoInlineCart = window.TwoCoInlineCart || {};
