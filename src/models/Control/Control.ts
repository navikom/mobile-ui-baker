import { action, computed, IObservableArray, observable } from "mobx";
import React from "react";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import Movable from "models/Movable";
import { ErrorHandler } from "utils/ErrorHandler";
import ICSSProperty from "interfaces/ICSSProperty";
import CSSProperty from "models/Control/CSSProperty";
import { CSS_VALUE_COLOR, CSS_VALUE_NUMBER, CSS_VALUE_SELECT } from "models/Constants";

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
      cssProperties: this.cssProperties.filter(prop => prop.enabled).map(prop => prop.toJSON)
    }
  }

  @computed get styles() {
    const styles: React.CSSProperties = {};
    this.cssProperties.filter(prop => prop.enabled).forEach((prop) => {
      // @ts-ignore
      styles[prop.key] = prop.inject ? prop.inject.replace('$', prop.value) : prop.valueWithUnit;
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
      new CSSProperty("backgroundColor", "#ffffff", "#ffffff", false, CSS_VALUE_COLOR),
      new CSSProperty("backgroundImage",
        "https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png",
        "https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png")
        .makeExpandable().setInjectable("url($)")
        .setDescription(["backgroundImageDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-image"]),
      new CSSProperty("backgroundSize", "", "").setShowWhen(["backgroundImage", "expanded"])
        .setDescription(["backgroundSizeDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-size"]),
      new CSSProperty("backgroundRepeat", "no-repeat", "no-repeat", false, CSS_VALUE_SELECT)
        .setShowWhen(["backgroundImage", "expanded"])
        .setOptions(["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round", "repeat space", "repeat repeat", "round space", "no-repeat round"])
        .setDescription(["backgroundSizeDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-size"]),
      new CSSProperty("width", 10, 10, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("height", 10, 10, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("minWidth", 10, 10, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("minHeight", 10, 10, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("maxWidth", 40, 40, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("maxHeight", 20, 20, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("padding", 15, 0, true)
        .makeExpandable(),
      new CSSProperty("paddingTop", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("paddingRight", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("paddingBottom", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("paddingLeft", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("margin", 0, 0).makeExpandable(),
      new CSSProperty("marginTop", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("marginRight", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("marginBottom", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("marginLeft", 0, 0, false, CSS_VALUE_NUMBER)
        .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("border", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)")
        .makeExpandable().setDescription(["borderDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/border"]),
      new CSSProperty("borderTop", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)")
        .setShowWhen(["border", "expanded"]),
      new CSSProperty("borderRight", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)")
        .setShowWhen(["border", "expanded"]),
      new CSSProperty("borderBottom", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)")
        .setShowWhen(["border", "expanded"]),
      new CSSProperty("borderLeft", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)").setShowWhen(["border", "expanded"]),
      new CSSProperty("borderRadius", 5, 5, false, CSS_VALUE_NUMBER)
        .makeExpandable().setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("borderTopLeftRadius", 5, 5, false, CSS_VALUE_NUMBER)
        .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("borderTopRightRadius", 5, 5, false, CSS_VALUE_NUMBER)
        .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("borderBottomRightRadius", 5, 5, false, CSS_VALUE_NUMBER)
        .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("borderBottomLeftRadius", 5, 5, false, CSS_VALUE_NUMBER)
        .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
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
    clone.mergeProperties(this.cssProperties);
  }

  @action mergeProperties(props: ICSSProperty[]) {
    const sliced = props.slice();
    let prop: ICSSProperty;
    while (prop = sliced.shift() as ICSSProperty) {
      const same = this.cssProperties.find(p => p.key === prop.key);
      if (same) {
        same.updateProperties(prop as unknown as {[key: string]: string | number});
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
