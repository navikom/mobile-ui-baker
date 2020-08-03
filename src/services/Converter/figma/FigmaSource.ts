import { IFigmaConverter } from './IFigmaConverter';

class FigmaSource {
  isSvg: boolean;
  path: string;
  content?: string;
  store: IFigmaConverter;


  constructor(store: IFigmaConverter, isSvg: boolean, path: string) {
    this.store = store;
    this.isSvg = isSvg;
    this.path = path;
  }

  async load() {
    const response = await fetch(this.path);

    if(this.isSvg) {
      const path = this.path.replace('https://s3-us-west-2.amazonaws.com/figma-alpha-api/', '')
        .split('?')[0];
      this.store.zipGenerator.svg2zip(path, await response.text());
    } else {
      const path = this.path.replace('https://s3-alpha-sig.figma.com/', '')
        .split('?')[0];
      this.store.zipGenerator.image2zip(path, await response.blob());
    }
  }
}

export default FigmaSource;
