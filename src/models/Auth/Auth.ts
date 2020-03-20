import { action, IReactionDisposer, observable, runInAction } from "mobx";
import Cookies from 'js-cookie';
import { api, Apis } from "api";
import { Errors } from "models/Errors";
import { IFlow } from "interfaces/IFlow";
import { App } from "models/App";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import validate from "validate.js";
import * as Constants from "models/Constants";
import { ILoginResult } from "interfaces/ILoginResult";
import { IAuthUser } from "interfaces/IAuthUser";

const constraints = {
  password: {
    presence: {
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.password))}`
    },
    length: {
      minimum: 6,
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeLessThan, [Dictionary.defValue(DictionaryService.keys.password), "6"])}`
    }
  },
  email: {
    presence: {
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, "Email")}`
    },
    email: {
      message: `^${Dictionary.defValue(DictionaryService.keys["auth:invalid-email"])}`
    }
  }
};

const registrConstraints = Object.assign({
  confirmPassword: {
    presence: {
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.confirmPassword))}`
    },
    equality: {
      attribute: "password",
      message: `^${Dictionary.defValue(DictionaryService.keys.repeatPasswordNotEqual)}`
    }
  }
}, constraints);

export class AuthStore extends Errors implements IFlow {
  static REMEMBER_ME = "rememberMe";

  @observable rememberMe = false;
  @observable anonymous = true;
  @observable sid?: string;

  disposer?: IReactionDisposer;

  @action
  async checkLocalStorage() {
    const rememberMe = localStorage.getItem(AuthStore.REMEMBER_ME);

    if (!rememberMe) {
      await this.fetchAnonymous();
    } else {
      await this.refresh();
    }
  }

  @action
  async signup(email: string, password: string) {
    try {
      this.update(await api(Apis.Main).user.signup(email, password));
    } catch (err) {
      this.setError(Dictionary.value(err.message));
    }
  }

  @action
  async login(email: string, password: string) {
    try {
      const data = await api(Apis.Main).user.login(email, password);
      this.update(data);
    } catch (err) {
      this.setError(Dictionary.value(err.message));
    }
  }

  @action
  async fetchAnonymous() {
    try {
      const data = await api(Apis.Main).user.anonymous();
      this.update(data);
    } catch (err) {
      this.setError(Dictionary.value(err.message));
    }
  }

  @action
  async refresh() {
    try {
      const data = await api(Apis.Main).user.refresh();
      this.update(data);
    } catch (err) {
      console.log("Refresh Error", err.message);
      App.navigationHistory && App.navigationHistory.push(Constants.LOGIN_ROUTE);
    }
  }

  @action
  update(response: ILoginResult) {
    this.anonymous = response.anonymous;
    this.sid = Cookies.get("sid");
    App.setUser(response.user);
  }

  @action
  async logout() {
    try {
      await api(Apis.Main).user.logout();
      runInAction(() => {
        this.anonymous = true;
      });
      localStorage.removeItem(AuthStore.REMEMBER_ME);
    } catch (err) {
      console.log("Logout Error", err.message);
    }
  }

  @action
  async start() {
    await this.checkLocalStorage();
  }

  @action
  switchRememberMe() {
    this.rememberMe = !this.rememberMe;
    if (this.rememberMe) {
      localStorage.setItem(AuthStore.REMEMBER_ME, AuthStore.REMEMBER_ME);
    } else {
      localStorage.removeItem(AuthStore.REMEMBER_ME);
    }
  }

  clearStorage() {
    localStorage.removeItem(AuthStore.REMEMBER_ME);
  }


  onInput(data: IAuthUser, login = false) {
    if (this.hasError) {
      this.setError(null);
    }
    return validate(data, login ? constraints : registrConstraints);
  }

  stop(): void {
    this.disposer && this.disposer();
  }
}

export const Auth = new AuthStore();
