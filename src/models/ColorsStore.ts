import { action, computed, observable } from 'mobx';
import { IScreen } from 'interfaces/IControl';
import CSSProperty, { CSS_SET_VALUE } from './Control/CSSProperty';
import ControlStore from './Control/ControlStore';

const getKeys = (value: string): string[] => {
  const keys = value.split('_');
  return [keys.pop() as string, keys.join('_')]
}

const getByColor = (list: {color: string; title: string}[], color: string) =>
  list.find(item => item.color === color)

export default class ColorsStore {
  @observable static colorsMap: Map<string, string[]> = new Map<string, string[]>();
  @observable static backgroundMap: Map<string, string> = new Map<string, string>();
  @observable static barColorsMap: Map<string, string> = new Map<string, string>();

  @computed static get colors() {
    const controlColors =
      Array.from(CSSProperty.colors.keys())
        .map(color => ({color, title: `Controls ${CSSProperty.colors.get(color)!.length}`}));
    const controlColorsList = controlColors.map(item => item.color);
    const screensColors = Array.from(this.colorsMap.keys())
      .map(color => ({color, title: `Screens ${this.colorsMap.get(color)!.length}`}));
    return screensColors.filter(item => {

      if(controlColorsList.includes(item.color)) {
        const controlItem = getByColor(controlColors, item.color);
        if(controlItem) {
          controlItem.title = `${item.title} ${controlItem.title}`;
        }
        return false;
      }
      return true;
    }).concat(controlColors);
  }

  @action static setColor(oldColor: string, newColor: string) {
    if(oldColor === newColor) {
      return;
    }
    if(this.colorsMap.has(oldColor)) {
      console.log('screens colors', this.colorsMap.get(oldColor));
      Array.from(this.backgroundMap.keys()).forEach(key => {
        if(this.backgroundMap.get(key) === oldColor) {
          (ControlStore.getById(key) as IScreen).setBackground(newColor, true);
        }
      });
      Array.from(this.barColorsMap.keys()).forEach(key => {
        if(this.barColorsMap.get(key) === oldColor) {
          (ControlStore.getById(key) as IScreen).setStatusBarColor(newColor, true);
        }
      });
    }
    if(CSSProperty.colors.has(oldColor)) {
      Array.from(CSSProperty.controlColor.keys()).forEach(key => {
        if(CSSProperty.controlColor.get(key) === oldColor) {
          const [style, id] = getKeys(key);
          const control = ControlStore.getById(id);
          control && control.applyPropertyMethod(style,  CSS_SET_VALUE, 'color', newColor);
        }
      });
      Array.from(CSSProperty.controlBackgroundColor.keys()).forEach(key => {
        if(CSSProperty.controlBackgroundColor.get(key) === oldColor) {
          const [style, id] = getKeys(key);
          const control = ControlStore.getById(id);
          control && control.applyPropertyMethod(style,  CSS_SET_VALUE, 'backgroundColor', newColor);
        }
      });
    }

  }

  @action
  static addColor(screen: IScreen, isBackground: boolean) {
    if(isBackground) {
      if(!screen.background) {
        return;
      }
      this.backgroundMap.set(screen.id, screen.background);
    } else {
      if(!screen.statusBarColor) {
        return;
      }
      this.barColorsMap.set(screen.id, screen.statusBarColor);
    }
    const key = isBackground ? screen.background : screen.statusBarColor;
    if(!this.colorsMap.has(key)) {
      this.colorsMap.set(key, []);
    }
    !this.colorsMap.get(key)!.includes(screen.id) && this.colorsMap.get(key)!.push(screen.id);
  }

  @action
  static deleteColor(screen: IScreen, isBackground: boolean) {
    if(isBackground && !this.backgroundMap.has(screen.id)) {
      return;
    }
    if(!isBackground && !this.barColorsMap.has(screen.id)) {
      return;
    }
    const key = isBackground ? screen.background : screen.statusBarColor;
    isBackground ? this.backgroundMap.delete(screen.id) : this.barColorsMap.delete(screen.id);
    if(this.colorsMap.has(key)) {
      const arr = this.colorsMap.get(key);
      const index = arr!.indexOf(screen.id);
      arr!.splice(index, 1);
      !arr!.length && this.colorsMap.delete(key);
    }
  }

  static clear() {
    Array.from(this.colorsMap.keys()).forEach(key => this.colorsMap.delete(key));
    Array.from(this.backgroundMap.keys()).forEach(key => this.backgroundMap.delete(key));
    Array.from(this.barColorsMap.keys()).forEach(key => this.barColorsMap.delete(key));
  }
}
