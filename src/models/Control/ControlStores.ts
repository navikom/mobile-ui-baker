import { ControlEnum } from "enums/ControlEnum";
import GridStore from "models/Control/GridStore";
import TextStore from "models/Control/TextStore";
import IControl from "interfaces/IControl";
import ControlStore, { ModelCtor } from "models/Control/ControlStore";
import IProject from "interfaces/IProject";

export const ControlStores = {
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
};

export default function CreateControl(type: ControlEnum, json?: IControl) {
  const control = ControlStore.create(ControlStores[type] as unknown as ModelCtor<IControl>, json || ControlStores[type].create());
  if(json && control.children.length === 0) {
    json.children.forEach(child => {
      control.addChild(CreateControl(child.type, child));
    });
  }
  return control;
}

export function CreateFromInstance(instance: IProject) {
  const controlData = instance.version.data as IControl;
  const control = CreateControl(controlData.type, controlData);
  control.changeTitle(instance.title, true);
  control.setInstance(instance);
  return control;
}
