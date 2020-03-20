import { action, computed, observable } from "mobx";
// interfaces
import { IApp } from "interfaces/IApp";
import { IPagination } from "interfaces/IPagination";
// models
import { Pagination } from "models/Pagination";
import { AppStore } from "models/App/AppStore";
// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { api, Apis } from "api";
import validate from "validate.js";

const constraints = {
  title: {
    presence: {
      message: `^${Dictionary.defValue(
        DictionaryService.keys.cantBeEmpty,
        Dictionary.defValue(DictionaryService.keys.title)
      )}`
    },
    length: {
      maximum: 20,
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [
        Dictionary.defValue(DictionaryService.keys.title),
        "20"
      ])}`
    }
  }
};

export class AppsStore extends Pagination<IApp> implements IPagination<IApp> {
  @observable errors: { [k: string]: string } = {};
  @observable title = "";

  @computed get appTableData() {
    return this.tableData((e: IApp) => [
      e.appId.toString(),
      e.title,
      Dictionary.timeDateString(e.createdAt),
      e.description || "—"
    ]);
  }

  @computed get isDisabled() {
    return (
      this.title.length === 0 ||
      Object.keys(this.errors).length > 0 ||
      this.fetching
    );
  }

  constructor() {
    super("appId", "app", 20, "pagination", [5, 10, 25, 50]);
  }

  @action push(data: IApp[]) {
    let l = data.length;
    while (l--) {
      if (!this.has(data[l].appId)) {
        this.items.push(AppStore.from(data[l]));
      }
    }
  }

  @action
  onInput(data: { [key: string]: string }) {
    this.errors = validate(data, constraints) || {};
    this.title = data.title;
  }

  @action
  getOrCreate(data: IApp) {
    if (!this.has(data.appId)) {
      this.push([data]);
    }
    return this.getById(data.appId);
  }

  @action async addApp() {
    try {
      const data = await api(Apis.Main).app.add({ title: this.title });
      this.push([data]);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
  }
}

export const Apps = new AppsStore();
