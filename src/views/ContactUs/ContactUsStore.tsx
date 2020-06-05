import { action, computed, observable } from 'mobx';
import validate from 'validate.js';
import { Errors } from 'models/Errors';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import React from 'react';
import { api, Apis } from '../../api';

interface FieldsProps {
  name: string;
  email: string;
  message: string;
}

class ContactUsStore extends Errors {
  constraints = {
    name: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.message))}`
      },
      length: {
        maximum: 50,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [Dictionary.defValue(DictionaryService.keys.name), '50'])}`
      }
    },
    message: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.message))}`
      },
      length: {
        maximum: 500,
        minimum: 10,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [Dictionary.defValue(DictionaryService.keys.message), '500', '10'])}`
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
  @observable loading = false;
  @observable name: string = '';
  @observable email: string = '';
  @observable message: string = ''
  @observable errors: {[key: string]: string} = {};
  @observable captchaChecked: boolean = false;
  fields: string[] = [];

  @computed get readyToSend(): boolean {
    return !this.hasError && Object.keys(this.errors).length === 0 && this.captchaChecked && !this.loading;
  }

  hasKeyInError(key: string) {
    return computed(() => {
      if(this.fields.length < 3) {
        return false;
      }
      return this.errors[key] !== undefined;
    }).get();
  }

  @action setLoading(value: boolean) {
    this.loading = value;
  }

  @action setCaptchaChecked = (value: string | null) => {
    if(value) {
      this.captchaChecked = true;
    }
  }

  @action
  async sendEmail(cb: () => void) {
    this.setLoading(true);
    try {
      await api(Apis.Main).user.sendEmailMessage(this.name, this.email, this.message);
      cb();
      this.clear();
    } catch (err) {
      this.setError(Dictionary.value(err.message));
    }
    this.setLoading(false);
  }

  @action
  onInput = (key: keyof FieldsProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.errors = validate(Object.assign({
      name: this.name,
      email: this.email,
      message: this.message
    },{ [key]: value }), this.constraints) || {};
    this[key] = value;
    !this.fields.includes(key) && this.fields.push(key);
  }
  @action clear() {
    super.clear();
    this.fields = [];
    this.name = '';
    this.email = '';
    this.message = '';
    this.captchaChecked = false;
  }
}

export default ContactUsStore;
