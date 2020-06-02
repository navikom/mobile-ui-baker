import { action, observable } from 'mobx';
import { Errors } from 'models/Errors';
import { MODE_DEVELOPMENT } from 'models/Constants';
import { App } from 'models/App';
import { v4 } from 'uuid';
import IProject from 'interfaces/IProject';
import { ITwoCoInlineCart } from 'types/global-window';

class CheckoutStore extends Errors {
  static PRO_PLAN_CODE = process.env.REACT_APP_2_PRO_PLAN || '';
  static MERCHANT = process.env.REACT_APP_2_CHECKOUT_ID || '';
  static CLOSE_EVENT = 'cart:closed';
  static PAYMENT_FINALIZED = 'payment:finalized';
  static FULFILLMENT_FINALIZED = 'fulfillment:finalized';
  static DYNAMIC = 'DYNAMIC';
  static YEAR = 'YEAR';
  @observable success = false;
  toCo: ITwoCoInlineCart = (window as any).TwoCoInlineCart;
  onCartClosed: void;
  onPaymentSuccess: void;
  code: string;
  uuid: string = v4().replace(/-/g, '');

  constructor(code?: string) {
    super();
    this.code = code || '';
    this.toCo.setup.setMerchant(CheckoutStore.MERCHANT);

    this.toCo.register();

    const _dev = process.env.NODE_ENV === MODE_DEVELOPMENT;
    _dev && this.toCo.cart.setTest(true);

    this.onPaymentSuccess = this.toCo.events.subscribe(CheckoutStore.PAYMENT_FINALIZED, this.paymentSuccess);
  }

  setUser() {
    const user = App.user;
    this.toCo.billing.setName(user!.fullName || '');
    this.toCo.billing.setEmail(user!.email || '');

    this.toCo.shipping.setName(user!.fullName || '');
    this.toCo.shipping.setEmail(user!.email || '');

    this.toCo.cart.setOrderExternalRef(this.uuid);
    this.toCo.cart.setExternalCustomerReference(user!.userId.toString());
  }

  startCheckout() {
    if (App.loggedIn) {
      // VISA	4111111111111111
      // MasterCard	5555555555554444
      // AMEX	378282246310005
      // Discover	6011111111111117
      // JCB	3566111111111113

      // Successful authorization for the initial transaction and all recurring charges. =>>  John Doe
      // Successful authorization for the initial transaction and manual renewal transactions
      // but recurring charges fail to authorize with the Insufficient Funds error message. =>> Mike Doe
      // Successful authorization for the initial transaction and manual renewal transactions but
      // recurring charges fail to authorize with the Stolen Card error message. =>> Jenny Doe
      // Insufficient funds =>> Mona Doe
      // Try again later =>> Mark Doe
      // Stolen card =>> Red Doe
      // Authentication failed =>> Joy Doe
      // Expired card =>> Angela Doe
      // Invalid card number =>> Adrian Doe
      // Invalid CVV (Security code) =>> Jack Doe

      this.setUser();
    }
    this.toCo.products.removeAll();

    this.toCo.products.add({
      code: this.code,
      quantity: 1
    });
    this.toCo.cart.checkout();

  }

  startCheckoutDynamic(project: IProject) {
    this.toCo.setup.setMode(CheckoutStore.DYNAMIC);
    this.toCo.cart.setCurrency('USD');
    this.toCo.events.unsubscribe(CheckoutStore.PAYMENT_FINALIZED, this.onPaymentSuccess);
    this.onPaymentSuccess =
      this.toCo.events.subscribe(CheckoutStore.PAYMENT_FINALIZED, this.paymentSuccess.bind(null, project));
    if (App.loggedIn) {
      this.setUser();
    }
    this.toCo.products.removeAll();

    this.toCo.products.add({
      name: project.title,
      externalReference: project.projectId.toString(),
      price: 30,
      quantity: 1
    });
    this.toCo.cart.checkout();
  }

  @action checkIsUserSubscribed() {
    App.fetchUserSubscription();
  }

  @action
  paymentSuccess = (project?: IProject) => {
    if(project) {
      console.log("Purchase", App.user && App.user.userId, project);
    } else {
      // App.user && App.user.update({plan: true} as IUser);
    }
  }

  dispose() {
    this.toCo.events.unsubscribe(CheckoutStore.CLOSE_EVENT, this.onCartClosed);
    this.toCo.events.unsubscribe(CheckoutStore.PAYMENT_FINALIZED, this.onPaymentSuccess);
  }
}

export default CheckoutStore;
