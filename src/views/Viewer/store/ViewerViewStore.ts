import { action, observable } from 'mobx';
import DisplayViewStore from 'models/DisplayViewStore';
import { App } from 'models/App';
import { MODE_DEVELOPMENT, ROUTE_VIEWER } from 'models/Constants';
import PaddleCheckoutStore from 'models/PaddleCheckoutStore';
import IProject from 'interfaces/IProject';

class ViewerViewStore extends DisplayViewStore {
  paddle = new PaddleCheckoutStore();
  @observable paymentSuccess = false;
  @observable paymentFailure = false;

  @action
  async fetchProjectData(projectId: number) {
    this.setFetchingProject(true);
    try {
      await super.fetchProjectData(projectId, true);
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Fetch full instance data error %s', err.message);
      App.navigationHistory && App.navigationHistory.replace(ROUTE_VIEWER);
    }
    this.setFetchingProject(false);
  }

  @action setPaymentSuccess(value: boolean) {
    this.paymentSuccess = value;
  }

  @action setPaymentFailure(value: boolean) {
    this.paymentFailure = value;
  }

  @action success() {
    this.setPaymentSuccess(true);
    this.project.update({ isBuyer: true } as IProject);
    this.setTimeOut(() => this.setPaymentSuccess(false), 3000);
  }

  @action failure() {
    this.setPaymentFailure(true);
    this.setTimeOut(() => this.setPaymentFailure(false), 5000);
  }

  async checkout() {
    try {
      await this.paddle.checkout(
        this.project.projectId,
        (payload) => {
          this.success();
        },
        (payload) => {
          this.failure();
        }
      );
    } catch (e) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Project checkout error %s', e.message);
    }

  }

}

export default ViewerViewStore;
