import IControl from '../interfaces/IControl';

class NavigationItem {
  screen: IControl;
  behavior: (string | number)[]
  constructor(screen: IControl, behavior: (string | number)[]) {
    this.screen = screen;
    this.behavior = behavior;
  }
}

export default NavigationItem;
