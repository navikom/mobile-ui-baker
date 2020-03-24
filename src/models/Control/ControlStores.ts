import { ControlEnum } from "models/ControlEnum";
import GridStore from "models/Control/GridStore";
import TextStore from "models/Control/TextStore";
import ButtonStore from "models/Control/ButtonStore";
import DrawerStore from "models/Control/DrawerStore";
import Control, { ModelCtor } from "models/Control/Control";
import IControl from "interfaces/IControl";

export const ControlStores = {
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
  [ControlEnum.Button]: ButtonStore,
  [ControlEnum.Drawer]: DrawerStore,
};

export default function CreateControl(type: ControlEnum) {
  return Control.create(ControlStores[type] as unknown as ModelCtor<IControl>, ControlStores[type].create());
}
