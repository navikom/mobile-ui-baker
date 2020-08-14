import { action, computed, observable } from 'mobx';
import { IScreen } from 'interfaces/IControl';
import CSSProperty, { CSS_SET_VALUE } from './Control/CSSProperty';
import ControlStore from './Control/ControlStore';

const getKeys = (value: string): string[] => {
  const keys = value.split('_');
  return [keys.pop() as string, keys.join('_')]
}

const getByColor = (list: { color: string; title: string }[], color: string) =>
  list.find(item => item.color === color)

export default class ColorsStore {
  @observable static colorsMap: Map<string, string[]> = new Map<string, string[]>();
  @observable static backgroundMap: Map<string, string> = new Map<string, string>();
  @observable static barColorsMap: Map<string, string> = new Map<string, string>();

  @computed
  static get colors() {
    const controlColorsList = Array.from(CSSProperty.colors.keys());
    const controlColors =
      controlColorsList.map(color => ({ color, title: `Controls (${CSSProperty.colors.get(color)!.length})` }));

    const colorsBordersList = Array.from(CSSProperty.colorsBorders.keys());
    const colorsBorders =
      colorsBordersList.map(color => ({ color, title: `Borders (${CSSProperty.colorsBorders.get(color)!.length})` }))
        .filter(item => {
          if (controlColorsList.includes(item.color)) {
            const controlItem = getByColor(controlColors, item.color);
            if (controlItem) {
              controlItem.title = `${controlItem.title} ${item.title}`;
            }
            return false;
          }
          return true;
        })

    const screensColors = Array.from(this.colorsMap.keys())
      .map(color => ({ color, title: `Screens (${this.colorsMap.get(color)!.length})` }));
    return screensColors.filter(item => {

      if (controlColorsList.includes(item.color)) {
        const controlItem = getByColor(controlColors, item.color);
        if (controlItem) {
          controlItem.title = `${item.title} ${controlItem.title}`;
        }
        return false;
      }
      return true;
    }).concat(colorsBorders, controlColors);
  }

  @computed
  static get borders() {
    return Array.from(CSSProperty.borders.keys())
      .map(border => ({ title: `${border} (${CSSProperty.borders.get(border)!.length})`, border }));
  }

  @action
  static setColor(oldColor: string, newColor: string) {
    if (oldColor === newColor) {
      return;
    }
    if (this.colorsMap.has(oldColor)) {
      Array.from(this.backgroundMap.keys()).forEach(key => {
        if (this.backgroundMap.get(key) === oldColor) {
          (ControlStore.getById(key) as IScreen).setBackground(newColor, true);
        }
      });
      Array.from(this.barColorsMap.keys()).forEach(key => {
        if (this.barColorsMap.get(key) === oldColor) {
          (ControlStore.getById(key) as IScreen).setStatusBarColor(newColor, true);
        }
      });
    }
    if (CSSProperty.colors.has(oldColor)) {
      Array.from(CSSProperty.controlColor.keys()).forEach(key => {
        if (CSSProperty.controlColor.get(key) === oldColor) {
          const [style, id] = getKeys(key);
          const control = ControlStore.getById(id);
          control && control.applyPropertyMethod(style, CSS_SET_VALUE, 'color', newColor);
        }
      });
      Array.from(CSSProperty.controlBackgroundColor.keys()).forEach(key => {
        if (CSSProperty.controlBackgroundColor.get(key) === oldColor) {
          const [style, id] = getKeys(key);
          const control = ControlStore.getById(id);
          control && control.applyPropertyMethod(style, CSS_SET_VALUE, 'backgroundColor', newColor);
        }
      });
    }

  }

  @action
  static setBorder(oldBorder: string, newBorder: string) {
    if (oldBorder === newBorder) {
      return;
    }
    if (CSSProperty.borders.has(oldBorder)) {
      Array.from(CSSProperty.controlBorders.keys()).forEach(key => {
        const [style, id] = getKeys(key);
        const control = ControlStore.getById(id);
        CSSProperty.controlBorders.get(key)!.forEach((border, i) => {
          if (border === oldBorder) {
            control && control.applyPropertyMethod(style, CSS_SET_VALUE, CSSProperty.BORDER_KEYS[i], newBorder);
          }
        })
      })
    }
  }

  @action
  static addColor(screen: IScreen, isBackground: boolean) {
    if (isBackground) {
      if (!screen.background) {
        return;
      }
      this.backgroundMap.set(screen.id, screen.background);
    } else {
      if (!screen.statusBarColor) {
        return;
      }
      this.barColorsMap.set(screen.id, screen.statusBarColor);
    }
    const key = isBackground ? screen.background : screen.statusBarColor;
    if (!this.colorsMap.has(key)) {
      this.colorsMap.set(key, []);
    }
    !this.colorsMap.get(key)!.includes(screen.id) && this.colorsMap.get(key)!.push(screen.id);
  }

  @action
  static deleteColor(screen: IScreen, isBackground: boolean) {
    if (isBackground && !this.backgroundMap.has(screen.id)) {
      return;
    }
    if (!isBackground && !this.barColorsMap.has(screen.id)) {
      return;
    }
    const key = isBackground ? screen.background : screen.statusBarColor;
    isBackground ? this.backgroundMap.delete(screen.id) : this.barColorsMap.delete(screen.id);
    if (this.colorsMap.has(key)) {
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
