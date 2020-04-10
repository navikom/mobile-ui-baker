import { ControlEnum } from "enums/ControlEnum";
import GridStore from "models/Control/GridStore";
import TextStore from "models/Control/TextStore";
import Control, { ModelCtor } from "models/Control/Control";
import IControl from "interfaces/IControl";

export const ControlStores = {
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
};

export default function CreateControl(type: ControlEnum, json?: IControl) {
  const control = Control.create(ControlStores[type] as unknown as ModelCtor<IControl>, json || ControlStores[type].create());
  if(json && control.children.length === 0) {
    json.children.forEach(child => {
      control.addChild(CreateControl(child.type, child));
    });
  }
  return control;
}
