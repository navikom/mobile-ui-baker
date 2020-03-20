import { Errors } from "models/Errors";
import { action, computed, observable } from "mobx";
import { api, Apis } from "api";
import React from "react";
import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IPagination } from "interfaces/IPagination";
import {ErrorHandler} from 'utils/ErrorHandler';

type ApiMethodsInterface = "user" | "event" | "app" | "pixartPicture" | "segment" | "campaign" | "region";
type RequestTypesInterface = "pagination";

export abstract class Pagination<T extends WithPrimaryKey> extends Errors implements IPagination<T> {
  started = false;
  page = 0;
  pageSize = 20;
  apiMethod: ApiMethodsInterface;
  requestMethod: RequestTypesInterface;
  additionalParams: any;
  pk: string;

  @observable fetching = false;
  @observable allFetched = false;
  @observable items: T[];
  @observable count = 0;

  // table pagination
  @observable viewRowsPerPage = 5;
  @observable viewPage = 0;
  rowsPerPageOptions: number[];

  @computed get isAllFetched(): boolean {
    return this.allFetched;
  }

  @computed get size() {
    return this.items.length;
  }

  tableData(cb: Function) {
    return computed(() => {
      const items = [];
      const start = this.viewPage * this.viewRowsPerPage;
      for (let i = start; i < Math.min(start + this.viewRowsPerPage, this.size); i++) {

        items.push(cb(this.items[i]));
      }
      return items;
    }).get();
  }

  getById(id: number): T | undefined {
    return computed(() => this.items.find((e: any) => e[this.pk] === id)).get();
  }

  has(id?: number): boolean {
    return computed(() => this.items.some((e: any) => id === e[this.pk])).get();
  }

  protected constructor(pKey: string, apiMethod: ApiMethodsInterface, size: number,
              requestMethod: RequestTypesInterface = "pagination", rowsPerPageOption: number[] = [5, 10, 25, 50],
              additionalParams?: any, viewRowsPerPage?: number) {
    super();
    this.pk = pKey;
    this.apiMethod = apiMethod;
    this.pageSize = size;
    this.requestMethod = requestMethod;
    this.additionalParams = additionalParams;
    this.rowsPerPageOptions = rowsPerPageOption;
    this.items = new Array<T>();
    viewRowsPerPage && (this.viewRowsPerPage = viewRowsPerPage);
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }

  @action setStarted(value = true) {
    this.started = value;
  }

  @action setPageData(data: any) {
    this.page = this.page + 1;
    this.count = data.count;
    if (this.size > 0 && (data.items.length < this.pageSize || this.size + data.items.length >= data.count)) {
      this.allFetched = true;
    } else if (this.size === 0) {
      this.setStarted(false);
      this.page = 0;
    }
  }

  @action setCount(count: number) {
    this.count = count;
  }

  @action
  async fetchItems() {
    if (this.started) {
      return false;
    }
    this.setStarted();
    return this.getNext();
  }

  @action push(data: any) {
    throw new ErrorHandler("Redefine in children");
  }

  @action
  async getNext(): Promise<boolean> {
    if (this.isAllFetched) return true;
    if (this.additionalParams) {
      const response = await api(Apis.Main)[this.apiMethod][this.requestMethod](this.page, this.pageSize, this.additionalParams);
      this.push(response.items);
      this.setPageData(response);
    } else {
      const response = await api(Apis.Main)[this.apiMethod][this.requestMethod](this.page, this.pageSize);
      this.push(response.items);
      this.setPageData(response);
    }

    return true;
  }

  @action reachedBottom = async (top: number, height: number) => {
    if (this.fetching) return;
    const paddingToBottom = 15;
    if (top >= height - paddingToBottom) {
      this.tryGetNext();
    }
  };

  @action async tryGetNext() {
    if (!this.fetching) {
      this.setFetching();
      try {
        await this.getNext();
      } catch (e) {
        this.setError(e.message);
      }
      this.setFetching(false);
    }
  }

  @action handleChangePageInView = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if(newPage * this.viewRowsPerPage >= this.size) {
      await this.tryGetNext();
    }
    this.viewPage = newPage;

  };

  @action handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.viewRowsPerPage = Number(event.target.value);
    this.viewPage = 0;
    this.pageSize = Math.max(20, this.viewRowsPerPage);
    if(this.pageSize > this.size) {
      await this.tryGetNext();
    }
  };

  @action
  setFetching(value = true) {
    this.fetching = value;
  }

  @action clear() {
    this.items = new Array<T>();
    this.started = false;
    this.page = 0;
    this.count = 0;
    this.allFetched = false;
  }
}
