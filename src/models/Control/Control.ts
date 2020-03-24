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
      if (prop.expanded) {
        prop.children.forEach((child) => {
          // @ts-ignore
          styles[child.key] = child.value;
        })
      } else {
        // @ts-ignore
        styles[prop.key] = prop.value;
      }
    });
    return styles;
  }

  constructor(type: ControlEnum, id: string, title: string, allowChildren: boolean = true) {
    super();
    this.id = id;
    this.type = type;
    this.allowChildren = allowChildren;
    this.title = title;
    this.cssProperties = observable([
      new CSSProperty("background", "#ffffff", "#ffffff"),
      new CSSProperty("padding", 15, 0, [
        new CSSProperty("paddingTop", 0, 0),
        new CSSProperty("paddingRight", 0, 0),
        new CSSProperty("paddingBottom", 0, 0),
        new CSSProperty("paddingLeft", 0, 0),
      ]),
      new CSSProperty("margin", 0, 0, [
        new CSSProperty("marginTop", 0, 0),
        new CSSProperty("marginRight", 0, 0),
        new CSSProperty("marginBottom", 0, 0),
        new CSSProperty("marginLeft", 0, 0),
      ]),
      new CSSProperty("border", "none", "none", [
        new CSSProperty("borderTop", "none", "none"),
        new CSSProperty("borderRight", "none", "none"),
        new CSSProperty("borderBottom", "none", "none"),
        new CSSProperty("borderLeft", "none", "none"),
      ]),
      new CSSProperty("borderRadius", 0, 0, [
        new CSSProperty("borderTopLeftRadius", 0, 0),
        new CSSProperty("borderTopRightRadius", 0, 0),
        new CSSProperty("borderBottomRightRadius", 0, 0),
        new CSSProperty("borderBottomLeftRadius", 0, 0),
      ]),
    ]);
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
    if (this.parentId) {
      const parent = Control.getById(this.parentId);
      parent && parent.removeChild(this);
    }
  };

  @action cloneProps(clone: IControl) {
    clone.changeTitle(this.title);
    clone.cssProperties.replace(this.cssProperties.map(prop => prop.clone()));
  }

  @action mergeProperties(props: ICSSProperty[]) {
    const sliced = props.slice();
    let prop: ICSSProperty;
    while (prop = sliced.shift() as ICSSProperty) {
      const same = this.cssProperties.find(p => p.key === prop.key);
      if (same) {
        same.value = prop.value;
        same.children.forEach((child, i) => (same.value = prop.children[i].value));
      } else {
        this.cssProperties.push(prop.clone());
      }
    }
  }

  clone(): IControl {
    throw new ErrorHandler("Redefine in children");
  }

  //######### static ##########//

  static has(controlId: string) {
    return this.controls.some(control => control.id === controlId);
  }

  static getById(id: string) {
    return this.controls.find(c => c.id === id);
  }

  static addItem(control: IControl) {
    this.controls.push(control);
  }

  static getOrCreate(instance: ModelCtor, control: IControl) {
    let contr = this.getById(control.id);
    if (!contr) {
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
