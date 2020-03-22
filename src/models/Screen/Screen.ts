import { observable } from "mobx";
import { IScreen } from "interfaces/IScreen";
import Movable from "models/Movable";
import GridStore from "models/Control/GridStore";

class ScreenStore extends Movable implements IScreen {
  @observable title: string = "Screen";

  constructor() {
    super();
    this.addChild(GridStore.create(this));
  }
}

export default ScreenStore;
