import AbstractDictionary, { IObject } from "services/Dictionary/AbstractDictionary";
import { action } from "mobx";

export const data = {
  controls: "controls",
  settings: "settings",
  screen: "screen",
  mode: "mode",
  white: "white",
  dark: "dark",
  background: 'background'
};

class EditorDictionary extends AbstractDictionary {
  static keys: typeof data = data;

  constructor() {
    super(data, {});
    let key: keyof typeof data;
    for (key in EditorDictionary.keys) {
      this.reversed[EditorDictionary.keys[key]] = key;
    }
  }

  @action setData<T extends typeof data>(newData: T & IObject) {
    Object.keys(this.data).forEach((k) => (this.data[k] = newData[k]));
  }
}

export default EditorDictionary;
