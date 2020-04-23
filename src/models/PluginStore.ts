import { action, observable } from 'mobx';
import { ROUTE_ROOT } from 'models/Constants';
import { data } from 'views/Editor/store/EditorDictionary';
import { IObject } from 'services/Dictionary/AbstractDictionary';
import { IProjectData } from 'interfaces/IProject';

interface IMuiConfig {
  autosave?: boolean;
  titleLink?: string;
  title?: string;
  dictionary?: typeof data;
  data?: IProjectData;
  hideHeader?: boolean;
}

interface IEditorView {
  dictionary?: { setData: <T extends typeof data>(newData: T & IObject) => void; };

  setLoadingPlugin(value: boolean): void;

  fromJSON(data: IProjectData): void;
  switchAutoSave?(): void;
  handleScreenshot?(): void;
  switchPortrait(): void;
  setIOS(value: boolean): void;
  setAutoSave?(value: boolean): void;
}

class EditorData {
  routeLink: string;
  routeTitle: string;
  hideHeader: boolean;
  dictionary: typeof data;

  constructor(routeLink: string, routeTitle: string, hideHeader: boolean = false, dictionary: typeof data = data) {
    this.routeLink = routeLink;
    this.routeTitle = routeTitle;
    this.hideHeader = hideHeader;
    this.dictionary = dictionary;
  }
}

class PluginStore {
  static LISTENER_ON_DATA = 'editor_on_data';
  static LISTENER_ON_SAVE_PROJECT = 'editor_on_save_project';
  static LISTENER_ON_SAVE_COMPONENT = 'editor_on_save_component';

  static LISTENER_ON_SWITCH_ORIENTATION = 'on_switch_orientation';
  static LISTENER_ON_SWITCH_OS = 'on_switch_os';
  static LISTENER_ON_ERROR = 'on_error';

  static FRAME_DATA_CONFIG = 'config';
  static FRAME_PRO_ACTION_SWITCH_ORIENTATION = 'switch_orientation';
  static FRAME_PRO_ACTION_SET_IOS = 'set_ios';
  static FRAME_PRO_ACTION_SWITCH_AUTO_SAVE = 'switch_auto_save';
  static FRAME_PRO_ACTION_SET_PROJECT = 'set_project';
  static FRAME_PRO_ACTION_MAKE_SCREENSHOT = 'make_screenshot';

  proMode: boolean = false;
  token: string = '';
  store: IEditorView;

  freeData: EditorData = new EditorData(ROUTE_ROOT, 'Mobile UI Editor');
  proData?: EditorData;
  origin?: string;

  @observable data: EditorData;

  constructor(store: IEditorView) {
    this.store = store;
    this.data = this.freeData;
  }

  init() {
    window.addEventListener('message', this.onMessage);
  }

  async fetchMode(query: string) {
    const tokenData = query.split('=');
    this.token = tokenData[1];
    try {
      // fetch access by token
      const response = {subscribed: true, origin: "*"};
      this.init();
      this.store.setLoadingPlugin(false);
      this.setProMode(response.subscribed);
      this.setOrigin(response.origin);
    } catch (err) {
      console.error(err);
    }
  }

  setProMode(proMode: boolean) {
    this.proMode = proMode;
    if (this.proMode) {
      this.proData && (this.data = this.proData);
    } else {
      this.data = this.freeData;
    }
    this.store.dictionary && this.store.dictionary.setData(this.data.dictionary)
  }

  setOrigin(origin: string) {
    this.origin = origin;
  }

  @action setConfig(config: IMuiConfig) {
    this.proData = new EditorData(
      config.titleLink && config.titleLink.length ? config.titleLink : this.freeData.routeLink,
      config.title && config.title.length ? config.title : this.freeData.routeTitle,
      config.hideHeader,
      config.dictionary
    );
    config.autosave !== undefined && this.store.setAutoSave && this.store.setAutoSave(config.autosave);
    config.data && this.store.fromJSON(config.data);
  }

  onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log('Frame store', event.data, event.origin);
    if (data[0] === PluginStore.FRAME_DATA_CONFIG) {
      this.setConfig(data[1]);
    }
    if(this.proMode) {
      switch(data[0]) {
        case PluginStore.FRAME_PRO_ACTION_SET_PROJECT:
          this.store.fromJSON(data[1]);
          break;
        case PluginStore.FRAME_PRO_ACTION_SWITCH_AUTO_SAVE:
          this.store.switchAutoSave && this.store.switchAutoSave();
          break;
        case PluginStore.FRAME_PRO_ACTION_SWITCH_ORIENTATION:
          this.store.switchPortrait();
          break;
        case PluginStore.FRAME_PRO_ACTION_SET_IOS:
          this.store.setIOS(data[1]);
          break;
        case PluginStore.FRAME_PRO_ACTION_MAKE_SCREENSHOT:
          this.store.handleScreenshot && this.store.handleScreenshot();
      }
    }
  };

  postMessage(action: string, message: string | { [key: string]: any }) {
    this.origin && window.parent.postMessage(JSON.stringify([action, message]), this.origin);
  }

  dispose() {
    window.removeEventListener('message', this.onMessage);
  }
}

export default PluginStore;
