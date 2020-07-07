import React from 'react';
import { action, computed, when } from 'mobx';

import { Button } from '@material-ui/core';
import SubscriptionPlans from 'models/SubscriptionPlans';
import { App } from 'models/App';
import PaddleCheckoutStore from 'models/PaddleCheckoutStore';
import {
  MODE_DEVELOPMENT,
  ROUTE_SUBSCRIPTION_DETAILS,
  SUBSCRIPTION_PADDLE_STATUS_ACTIVE,
  SUBSCRIPTION_PADDLE_STATUS_DELETED, SUBSCRIPTION_PADDLE_STATUS_PAST_DUE
} from 'models/Constants';
import ISubscriptionPlan from 'interfaces/ISubscriptionPlan';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { api, Apis } from 'api';
import { Brightness1 } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';

class SubscriptionsStore {
  list: Map<string, ISubscriptionPlan> = new SubscriptionPlans().plans;
  paddle = new PaddleCheckoutStore();

  @computed get user() {
    return App.user;
  }

  @computed get subscriptions() {
    return this.user ? this.user.subscriptions : [];
  }

  @computed get tableRows() {
    return this.subscriptions.map(subscription => {
      const instance = this.list.get(subscription.planId.toString());
      return [
        instance!.title,
        Dictionary.dateString(subscription.createdAt),
        subscription.status === SUBSCRIPTION_PADDLE_STATUS_DELETED ? '-' : Dictionary.dateString(subscription.nextBillDate),
        [Grid, { container: true, alignItems: 'center' }, [
          React.createElement(Brightness1, {
            key: 'item1',
            style: {
              fontSize: 10,
              marginRight: 5,
              color: subscription.status === SUBSCRIPTION_PADDLE_STATUS_ACTIVE ? 'green' : subscription.status === SUBSCRIPTION_PADDLE_STATUS_PAST_DUE ? 'orange' : 'grey',
            },
          }),
          Dictionary.value(subscription.status)]
        ],
        [Button, {
          variant: 'outlined',
          color: 'primary',
          size: 'small',
          onClick: () => App.navigationHistory && App.navigationHistory.push(`${ROUTE_SUBSCRIPTION_DETAILS}/${subscription.subscriptionId}`)
        }, [Dictionary.defValue(DictionaryService.keys.details)], { align: 'center' }]
      ]
    })
  }

  constructor() {
    when(() => App.loggedIn, () => {
      this.fetchSubscriptionsFullData();
    })
  }

  @action
  async fetchSubscriptionsFullData() {
    try {
      const subscriptions = await api(Apis.Main).user.subscriptionsFullData();
      this.user!.updateSubscriptions(subscriptions);
    } catch (e) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Fetch subscription full data', e.message);
    }
  }

  checkout(plan: ISubscriptionPlan) {
    this.paddle.subscribeToPlan(plan.id.toString());
  }
}

export default SubscriptionsStore;
