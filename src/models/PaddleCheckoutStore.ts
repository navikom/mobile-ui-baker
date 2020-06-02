import { observable } from 'mobx';
import { Errors } from 'models/Errors';
import { App } from 'models/App';
import { ERROR_USER_DID_NOT_LOGIN, MODE_DEVELOPMENT, SUBSCRIPTION_PADDLE_STATUS_DELETED } from 'models/Constants';
import { ICheckoutParams, IPaddle } from 'types/global-window';
import { ErrorHandler } from 'utils/ErrorHandler';
import { api, Apis } from 'api';

class PaddleCheckoutStore extends Errors {
  static VENDOR_ID = Number(process.env.REACT_APP_PADDLE_VENDOR_ID) || 0;
  paddle: IPaddle = (window as any).Paddle;
  @observable loading = false;

  constructor() {
    super();
    this.paddle.Setup({ vendor: PaddleCheckoutStore.VENDOR_ID });
  }

  subscribeToPlan(plan: string) {
    if (!App.loggedIn) {
      throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
    }
    const _dev = process.env.NODE_ENV === MODE_DEVELOPMENT;
    const payload: ICheckoutParams = {
      product: plan,
      email: App.user!.email || '',
      passthrough: JSON.stringify({ user_id: App.user!.userId }),
      successCallback: (data) => {
        console.log('onSuccess=========', data);
        App.user!.setPlan(plan);
      }
    } as ICheckoutParams;
    if (_dev) {
      payload.coupon = 'test1';
    }
    this.paddle.Checkout.open(payload);
  }

  cancel(subscriptionId: number, url: string) {
    this.paddle.Checkout.open({
      override: url,
      successCallback: (data) => {
        if (App.user) {
          App.user!.setPlan('0');
          App.user!.updateStatusInSubscription(subscriptionId, SUBSCRIPTION_PADDLE_STATUS_DELETED);
        }
      }
    });
  }

  updateSubscription(url: string) {
    this.paddle.Checkout.open({
      override: url,
    });
  }

  async updatePlan(subscriptionId: number, paddleSubscriptionId: number, planId: number) {
    try {
      await api(Apis.Main).paddle.setPlan(paddleSubscriptionId, planId);
      App.user!.setPlan(planId.toString());
      App.user!.updatePlanInSubscription(subscriptionId, planId);
    } catch (e) {
      console.log('Update plan error %s', e.message);
    }

  }
}

export default PaddleCheckoutStore;
