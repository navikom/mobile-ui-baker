import { action, computed, observable } from "mobx";
import { IErrors } from "interfaces/IErrors";

export class Errors implements IErrors {
  @observable error: string | null = null;
  @observable successRequest = false;
  private timeOutId?: NodeJS.Timeout;

  @computed get hasError(): boolean {
    return this.error !== null;
  }

  @action setError(error: string | null = null) {
    this.error = error;
  }

  @action setSuccessRequest(value: boolean) {
    this.successRequest = value;
  }

  setTimeOut(cb: () => void, time: number) {
    this.timeOutId = setTimeout(cb, time);
  }

  clear() {
    this.timeOutId && clearTimeout(this.timeOutId);
  }
}
