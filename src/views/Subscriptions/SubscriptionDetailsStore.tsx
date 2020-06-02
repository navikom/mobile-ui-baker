import { action, IReactionDisposer, observable, when, reaction, runInAction } from 'mobx';
import ISubscription from 'interfaces/ISubscription';
import { App } from 'models/App';
import PaddleCheckoutStore from 'models/PaddleCheckoutStore';
import { api, Apis } from 'api';
import { Errors } from 'models/Errors';
import ISubscriptionPlan from 'interfaces/ISubscriptionPlan';
import SubscriptionPlans from 'models/SubscriptionPlans';
import { SUBSCRIPTION_PADDLE_STATUS_DELETED } from '../../models/Constants';

class SubscriptionDetailsStore extends Errors {
  @observable subscription?: ISubscription;
  @observable plan?: ISubscriptionPlan;
  @observable status: string = SUBSCRIPTION_PADDLE_STATUS_DELETED;
  planReactionDisposer?: IReactionDisposer;
  statusReactionDisposer?: IReactionDisposer;
  paddle = new PaddleCheckoutStore();

  constructor(id: number) {
    super();
    when(() => App.loggedIn, () => {
      this.assign(id);
    });
  }

  @action assign(id: number) {
    const subscriptions = App.user!.subscriptions;
    this.subscription = subscriptions.find(subscription => subscription.subscriptionId === id);
    if(this.subscription) {
      !this.subscription.payments && this.fetchSubscriptionPayments();
      this.assignPlan();
      this.status = this.subscription.status;
      this.listen();
    }
  }

  @action assignPlan() {
    const plans = new SubscriptionPlans().plans;
    this.plan = plans.get(this.subscription!.planId.toString());
  }

  listen() {
    this.planReactionDisposer = reaction(() => this.subscription && this.subscription.planId, () => {
      this.assignPlan();
    });
    this.statusReactionDisposer = reaction(() => this.subscription && this.subscription.status, () => {
      runInAction(() => {
        this.status = this.subscription!.status;
      });
    })
  }

  @action async fetchSubscriptionPayments() {
    try {
      const payments = await api(Apis.Main).payment.getBySubscriptionId(this.subscription!.subscriptionId);
      App.user!.updateSubscriptionPayments(this.subscription!, payments);
    } catch (err) {
      this.setError(err.message);
    }
  }

  @action cancel = () => {
    this.paddle.cancel(this.subscription!.subscriptionId, this.subscription!.cancelUrl);
  }

  @action updatePaymentMethod = () => {
    this.paddle.updateSubscription(this.subscription!.updateUrl);
  }

  @action updatePlan = (planId: number) => {
    this.paddle.updatePlan(this.subscription!.subscriptionId, this.subscription!.serviceSubscriptionId, planId);
  }

  dispose() {
    this.planReactionDisposer && this.planReactionDisposer();
  }
}

export default SubscriptionDetailsStore;
