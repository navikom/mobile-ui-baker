import { action, computed, IObservableArray, observable } from "mobx";
import React from "react";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import Movable from "models/Movable";
import { ErrorHandler } from "utils/ErrorHandler";
import ICSSProperty from "interfaces/ICSSProperty";
import CSSProperty from "models/Control/CSSProperty";

type ModelType = IControl;
export type ModelCtor<M extends IControl = IControl> = (new (id: string) => M) & ModelType;

class Control extends Movable implements IControl {
  type: ControlEnum;
  id: string;
  readonly allowChildren: boolean;
  static controls: IControl[] = [];
  @observable title: string;
  @observable parentId?: string;
  @observable dropTarget?: DropEnum;
  @observable visible: boolean = true;
  @observable cssProperties: IObservableArray<ICSSProperty>;

  get toJSON() {
    return {
      type: this.type,
      title: this.title,
      parentId: this.parentId,
      children: this.children.map(child => child.toJSON),
      id: this.id,
      allowChildren: this.allowChildren,
      cssProperties: this.cssProperties.map(prop => prop.toJSON)
    }
  }

  @computed get styles() {
    const styles: React.CSSProperties = {};
    this.cssProperties.forEach((prop) => {
      // @ts-ignore
      prop.enabled && (styles[prop.key] = prop.value);
    });
    return styles;
  }

  constructor(type: ControlEnum, id: string, title: string, allowChildren: boolean = true) {
    super();
    this.id = id;
    this.type = type;
    this.allowChildren = allowChildren;
    this.title = title;
    this.cssProperties = observable([new CSSProperty("padding", "1rem", true)]);
  }

  @action switchVisibility = () => {
    this.visible = !this.visible;
  };

  @action setParent(parentId?: string): void {
    this.parentId = parentId;
  }

  @action setTarget(target?: DropEnum): void {
    this.dropTarget = target;
  }

  @action deleteSelf = () => {
    if(this.parentId) {
      const parent = Control.getById(this.parentId);
      parent && parent.removeChild(this);
    }
  };

  @action cloneProps(clone: IControl) {
    clone.changeTitle(this.title);
    clone.cssProperties.replace(this.cssProperties.map(prop => prop.clone()));
  }

  clone(): IControl {
    throw new ErrorHandler("Redefine in children");
  }

  static getById(id: string) {
    return this.controls.find(c => c.id === id);
  }

  static addItem(control: IControl) {
    this.controls.push(control);
  }

  static getOrCreate(instance: ModelCtor, control: IControl) {
    let contr = this.getById(control.id);
    if(!contr) {
      contr = Control.fromJSON(instance, control);
      this.addItem(contr);
    }
    return contr;
  }

  static removeItem(control: IControl) {
    this.controls.splice(this.controls.indexOf(control), 1);
  }

  static fromJSON(instance: ModelCtor, json: IControl) {
    const control = new instance(json.id);
    control.title = json.title;
    control.parentId = json.parentId;
    control.children.replace(json.children);
    control.cssProperties.replace(json.cssProperties.map(prop => CSSProperty.fromJSON(prop)));
    return control;
  }

  static create(instance: ModelCtor, control: IControl) {
    return this.getOrCreate(instance, control);
  }
}

export default Control;
