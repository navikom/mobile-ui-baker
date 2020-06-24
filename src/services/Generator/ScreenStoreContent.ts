import IScreenStoreContent from 'interfaces/IScreenStoreContent';

class ScreenStoreContent implements IScreenStoreContent {
  path: string[];
  id: string;
  action?: string[][];
  source?: string[][];
  text?: string;
  classes: string[];

  get hasAction() {
    return this.action !== undefined && this.action.length > 0;
  }

  get hasSource() {
    return this.source !== undefined;
  }

  constructor(id: string, path: string[], classes: string[], source?: string[][], action?: string[][], text?: string) {
    this.id = id;
    this.path = path;
    action && action.length > 0 && (this.action = action);
    this.source = source;
    this.text = text;
    this.classes = classes;
  }
}

export default ScreenStoreContent;
