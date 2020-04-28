declare interface IToCoProduct {
  code: string;
  type?: string;
  quantity: number;
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

declare global {
  interface Window {
    TwoCoInlineCart: ITwoCoInlineCart;
  }
}

window.TwoCoInlineCart = window.TwoCoInlineCart || {};
