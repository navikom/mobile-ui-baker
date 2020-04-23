import { action, observable } from "mobx";
import validate from "validate.js";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { Validate } from "models/Validate";

export type PasswordType = "password" | "confirmPassword" | "newPassword";

export class ChangePasswordStore extends Validate {
  constrains = {
    password: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.password))}`
      },
      length: {
        minimum: 6,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeLessThan, [Dictionary.defValue(DictionaryService.keys.password), '6'])}`
      }
    },
    confirmPassword: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.confirmPassword))}`
      },
      equality: {
        attribute: "newPassword",
        message: `^${Dictionary.defValue(DictionaryService.keys.repeatNewPasswordNotEqual)}`
      }
    },
    newPassword: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.newPassword))}`
      },
      length: {
        minimum: 6,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeLessThan, [Dictionary.defValue(DictionaryService.keys.newPassword), '6'])}`
      }
    }
  };

  @observable password = "";
  @observable confirmPassword = "";
  @observable newPassword = "";

  @action onInput(key: PasswordType, value: string) {
    const object = {password: this.password, newPassword: this.newPassword, confirmPassword: this.confirmPassword};
    const errors = validate(Object.assign(object, {[key]: value}), this.constrains) || {};
    this.errors = errors;
    this[key] = value;
  }

  @action clear() {
    this.password = "";
    this.confirmPassword = "";
    this.newPassword = "";
  }
}
