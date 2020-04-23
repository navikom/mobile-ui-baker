import { action, computed, observable, runInAction } from "mobx";
import { Errors } from "models/Errors";
import { ChangePasswordStore } from "models/User/ChangePasswordStore";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { App } from "models/App";
import { ROUTE_ROOT } from "models/Constants";
import { api, Apis } from "api";

class ResetPasswordStore extends Errors {
  @observable store = new ChangePasswordStore();
  @observable successMessage: string = "";
  @observable fetching: boolean = false;
  token: string;

  @computed get readyToSave() {
    return this.store.newPassword.length > 0 && this.store.confirmPassword.length > 0 && !this.hasError
      && this.store.errors.newPassword === undefined && this.store.errors.confirmPassword === undefined;
  }

  constructor(token: string) {
    super();
    this.token = token;
  }

  @action setFetching(value: boolean) {
    this.fetching = value;
  }

  @action async savePassword() {
    try {
      this.setFetching(true);
      await api(Apis.Main).user.reset(this.token, this.store.newPassword, this.store.confirmPassword);
      runInAction(() => {
        this.successMessage = Dictionary.defValue(DictionaryService.keys.newPasswordWasSaved);
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => {
        this.setSuccessRequest(false);
        App.navigationHistory && App.navigationHistory.replace(ROUTE_ROOT);
      }, 5000);
    } catch (err) {
      this.setError(Dictionary.value(err.message));
    }
    this.setFetching(false);
  }
}

export default ResetPasswordStore;
