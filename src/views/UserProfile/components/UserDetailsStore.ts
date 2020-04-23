import { action, computed, observable, when } from "mobx";
import moment from "moment";
import validate from "validate.js";

// interfaces
import { IUser } from "interfaces/IUser";

// models
import { UserStore } from "models/User/UserStore";
import { Errors } from "models/Errors";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

import { api, Apis } from "api";
import { ChangePasswordStore } from "models/User/ChangePasswordStore";
import { Validate } from "models/Validate";


validate.extend(validate.validators.datetime, {
  parse: function(value: Date) {
    return +moment.utc(value);
  },
  format: function(value: Date, options: {dateOnly: boolean}) {
    const format = options.dateOnly ? "MM/DD/YYYY" : "YYYY-MM-DD hh:mm:ss";
    return moment.utc(value).format(format);
  },
});

class PersonalDataStore extends Validate {
  constraints = {
    firstName: {
      length: {
        maximum: 50,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [Dictionary.defValue(DictionaryService.keys.firstName), "50"])}`
      }
    },
    lastName: {
      length: {
        maximum: 50,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [Dictionary.defValue(DictionaryService.keys.lastName), "50"])}`
      }
    },
    phone: {
      format: {
        // eslint-disable-next-line
        pattern: /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4}|\d{6})$/g,
        message: `^${Dictionary.defValue(DictionaryService.keys.invalid, Dictionary.defValue(DictionaryService.keys.phone))}`
      },
    }
  };
  @observable formUser: IUser = UserStore.emptyUser();

  @action
  onInput(data: IUser) {
    try {
      this.errors = validate(data, this.constraints) || {};
      this.formUser.updateForm(data);
    } catch (e) {
      console.log("Validation error", e);
    }
  }
}

class UserDetailsStore extends Errors {
  @observable user?: IUser;
  @observable personalDataStore = new PersonalDataStore();
  @observable fetching = false;
  @observable passwordStore = new ChangePasswordStore();
  @observable currentReferral?: IUser;

  @computed get isPersonalDisabled() {
    return this.personalDataStore.isDisabled || this.hasError;
  }

  @computed get isPasswordStoreDisabled() {
    return this.passwordStore.isDisabled || this.hasError;
  }

  @action bindUser(user?: IUser) {
    this.user = user;
    if(user) {
      when(() => user.fullDataLoaded, () => this.personalDataStore.formUser.updateForm(user));
    }
  }

  @action bindCurrentReferral(userId: string) {
    this.currentReferral = this.user!.referrals.getById(parseInt(userId));
  }

  @action async saveUser() {
    try {
      const data = await api(Apis.Main).user.update(this.personalDataStore.formUser.userId, {
        firstName: this.personalDataStore.formUser.firstName,
        lastName: this.personalDataStore.formUser.lastName,
        birthday: this.personalDataStore.formUser.birthday,
        phone: this.personalDataStore.formUser.phone,
        subscription: this.personalDataStore.formUser.subscription,
        notificationEmail: this.personalDataStore.formUser.notificationEmail,
        notificationSms: this.personalDataStore.formUser.notificationSms,
        gender: this.personalDataStore.formUser.gender
      });
      this.user!.update(data);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
  }

  @action async saveNewPassword() {
    try {
      await api(Apis.Main).user.changePassword(this.passwordStore.password, this.passwordStore.newPassword);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
      this.passwordStore.clear();
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
  }
}

export const UserDetails = new UserDetailsStore();
