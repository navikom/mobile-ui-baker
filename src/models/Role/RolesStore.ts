import React from "react";
import { action, computed, IObservableArray, observable, runInAction } from "mobx";
import validate from "validate.js";

// @material-ui/icons
import { Save, Delete } from "@material-ui/icons";

// models
import { Errors } from "models/Errors";
// interfaces
import { IRoles } from "interfaces/IRoles";
import { IRole } from "interfaces/IRole";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { RoleStore } from "models/Role/RoleStore";
import { api, Apis } from "api";
import CellInputForm from "components/CustomInput/CellInputForm";
import Fab from "components/CustomButtons/Fab";

const constraints = {
  name: {
    presence: {
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.name))}`
    },
    length: {
      maximum: 30,
      minimum: 3,
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [Dictionary.defValue(DictionaryService.keys.title), '30', '3'])}`
    }
  }
};

class RolesStore extends Errors implements IRoles {
  @observable errors: {[k: string]: string} = {};
  @observable name = "";
  @observable rowName = "";
  @observable fetched = false;
  @observable fetching = false;
  @observable currentRow = -1;
  readonly items: IObservableArray<IRole> = observable<IRole>([]);

  @computed get tableData() {
    return this.items.map((e: IRole, i: number) => {
      const disabled = this.rowName === e.name || this.isRowBtnDisabled;
      const showBtns = this.currentRow === i && !e.deletedAt;
      return [
        e.roleId.toString(),
        showBtns ?
          [CellInputForm,
            {
              value: this.rowName,
              color: "primary",
              disabled,
              icon: Save,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => this.onRowInput({ name: e.target.value }),
              onClick: () => this.updateRole(e)
            }]
          : e.name,
        Dictionary.timeDateString(e.createdAt),
        Dictionary.timeDateString(e.updatedAt),
        Dictionary.timeDateString(e.deletedAt),
        showBtns ? [Fab, {color: "primary", size: "superSm", onClick: () => this.deleteRole(e)}, React.createElement(Delete)] : ""]
    });
  }

  @computed get isDisabled() {
    return this.name.length === 0 || Object.keys(this.errors).length > 0 || this.fetching;
  }

  @computed get isRowBtnDisabled() {
    return this.rowName.length === 0 || Object.keys(this.errors).length > 0 || this.fetching;
  }

  has(id: number): boolean {
    return computed(() => this.items.some((e: any) => e.roleId === id)).get();
  }

  getById(id: number): IRole | undefined {
    return computed(() => this.items.find((e: any) => e.roleId === id)).get();
  }

  @action push(data: IRole[]) {
    let l = data.length, i = 0;
    while (l--) {
      if(!this.has(data[i].roleId)) {
        this.items.push(RoleStore.from(data[i]));
      }
      i++;
    }
  }

  @action setFetched(value = true) {
    this.fetched = value;
  }

  @action setFetching(value = true) {
    this.fetching = value;
  }

  @action async fetch() {
    if(this.fetched) return;
    this.setFetching();
    try {
      const data = await api(Apis.Main).role.list();
      this.setFetched();
      this.push(data);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
    }
    this.setFetching(false);
  }

  @action async addRole() {
    this.setFetching();
    try {
      const data = await api(Apis.Main).role.add({name: this.name});
      this.push([data]);
      runInAction(() => {
        this.name = "";
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
    this.setFetching(false);
  }

  @action async updateRole(role: IRole) {
    try {
      const data = await api(Apis.Main).role.update(role.roleId, {name: this.rowName});
      role.update(data);
      this.setCurrentRow("", -1);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
  }

  @action async deleteRole(role: IRole) {
    try {
      await api(Apis.Main).role.delete(role.roleId);
      role.update({deletedAt: new Date()} as IRole);
      this.setCurrentRow("", -1);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (e) {
      this.setError(Dictionary.value(e.message));
      this.setTimeOut(() => this.setError(null), 10000);
    }
  }

  @action
  onInput(data: {[key: string]: string}) {
    this.errors = validate(data, constraints) || {};
    this.name = data.name;
  }

  @action
  onRowInput(data: {[key: string]: string}) {
    this.errors = validate(data, constraints) || {};
    this.rowName = data.name;
  }

  @action setCurrentRow(name: string, row: number) {
    if(this.currentRow !== row) {
      this.currentRow = row;
      this.rowName = name;
    }
  }

  @action getOrCreate(data: IRole): IRole {
    if(!this.has(data.roleId)) {
      this.push([data]);
    }
    return this.getById(data.roleId) as IRole;
  }
}

export const Roles = new RolesStore();
