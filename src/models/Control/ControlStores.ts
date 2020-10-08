import { v4 as uuidv4 } from 'uuid';
import { ControlEnum } from 'enums/ControlEnum';
import GridStore from 'models/Control/GridStore';
import TextStore from 'models/Control/TextStore';
import ScreenStore from 'models/Control//ScreenStore';
import IControl, { IGrid } from 'interfaces/IControl';
import ControlStore, { ModelCtor } from 'models/Control/ControlStore';
import IProject from 'interfaces/IProject';

export const ControlStores = {
  [ControlEnum.Screen]: ScreenStore,
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
};

export default function CreateControl(type: ControlEnum, json?: IControl, menu?: boolean) {
  const control = ControlStore.create(ControlStores[type] as unknown as ModelCtor<IControl>, json || ControlStores[type].create(), menu);
  if(json && control.children.length === 0) {
    json.children.forEach(child => {
      control.addChild(CreateControl(child.type, child, menu));
    });
  }
  return control;
}

export function CloneControl(json: IControl) {
  json.id = uuidv4();
  const control = ControlStore.clone(ControlStores[json.type] as unknown as ModelCtor<IControl>,json);
  if(json && control.children.length === 0) {
    json.children.forEach(child => {
      control.addChild(CloneControl(child));
    });
  }
  return control;
}

export function CreateForMenu(instance: IProject) {
  const controlData = instance.version.data as IGrid;

  if(ControlStore.has(controlData.id)) {
    const control = ControlStore.getById(controlData.id) as IGrid;
    const clone = control.clone(true);
    clone.setParent();
    clone.changeTitle(instance.title, true);
    clone.setInstance(instance);
    clone.cloneActions();
    clone.deleteClonedId();
    return clone;
  }
  controlData.parentId !== undefined && (controlData.parentId = undefined);

  const control = controlData.type ?
    CreateControl(controlData.type, controlData, true) :
    CreateControl(ControlEnum.Grid, undefined, true)
  ;

  control.changeTitle(instance.title, true);
  control.setInstance(instance);
  return control;
}
