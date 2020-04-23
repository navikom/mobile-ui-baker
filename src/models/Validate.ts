import { computed, observable } from "mobx";

export class Validate {
  @observable errors: {[k: string]: string} = {};

  @computed get isDisabled() {
    return Object.keys(this.errors).length > 0;
  }
}
