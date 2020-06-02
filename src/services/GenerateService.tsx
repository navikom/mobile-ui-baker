import IMobileUIView from 'interfaces/IMobileUIView';
import IControl from 'interfaces/IControl';

class GenerateService {
  store: IMobileUIView;
  components: Map<string, IControl[]> = new Map<string, IControl[]>();
  styledComponents: Map<string, IControl[]> = new Map<string, IControl[]>();
  titledComponents: Map<string, IControl[]> = new Map<string, IControl[]>();
  navigation: IControl[] = [];
  tab: IControl[] = [];
  leftDrawer: IControl[] = [];
  rightDrawer: IControl[] = [];
  constructor(store: IMobileUIView) {
    this.store = store;
  }

  generateRN() {
    this.store.screens.forEach(screen => screen.setChecksum(0, [], (depth: number, control: IControl) => {
      console.log(control.title, depth);
    }));

    let traverse: (controls: IControl[]) => void;
    (traverse = (controls: IControl[]) => {

      controls.forEach(child => {
        const hash = child.hashChildren as string;
        const sHash = child.hashChildrenWithStyle as string;
        const tHash = child.hashChildrenWithStyleAndTitles as string;
        if(!this.components.has(hash)) {
          this.components.set(hash, []);
        }
        this.components.get(hash)!.push(child);

        if(!this.styledComponents.has(sHash)) {
          this.styledComponents.set(sHash, []);
        }
        this.styledComponents.get(sHash)!.push(child);

        if(!this.titledComponents.has(tHash)) {
          this.titledComponents.set(tHash, []);
        }
        this.titledComponents.get(tHash)!.push(child);

        traverse(child.children);
      });

    })(this.store.screens);

    this.components.forEach((value, key) => {
      console.log(key, value.length, value.map(e => e.title));
    });
    console.log('Components size=%d', this.components.size);
    console.log('=======================');

    this.styledComponents.forEach((value, key) => {
      console.log(key, value.length, value.map(e => e.title));
    });
    console.log('Styled Components size=%d', this.styledComponents.size);
    console.log('=======================');

    this.titledComponents.forEach((value, key) => {
      console.log(key, value.length, value.map(e => e.title));
    });
    console.log('Titled Components size=%d', this.titledComponents.size);
  }
}

export default GenerateService;
