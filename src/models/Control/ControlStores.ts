import { ControlEnum } from "models/ControlEnum";
import GridStore from "models/Control/GridStore";
import TextStore from "models/Control/TextStore";
import Control, { ModelCtor } from "models/Control/Control";
import IControl from "interfaces/IControl";

export const ControlStores = {
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
};

export default function CreateControl(type: ControlEnum, json?: IControl) {
  return Control.create(ControlStores[type] as unknown as ModelCtor<IControl>, json || ControlStores[type].create());
}
