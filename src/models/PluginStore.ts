import { action, computed, IObservableArray, observable, when } from 'mobx';
import { MODE_DEVELOPMENT, ROUTE_ROOT } from 'models/Constants';
import { data } from 'views/Editor/store/EditorDictionary';
import IProject, { IProjectData } from 'interfaces/IProject';
import { api, Apis } from 'api';
import IMobileUIView from 'interfaces/IMobileUIView';
import { App } from './App';
import { OwnComponents } from './Project/OwnComponentsStore';
import { SubscriptionPlanEnum } from 'enums/SubscriptionPlanEnum';
import ProjectStore from './Project/ProjectStore';

interface IMuiConfig {
  autoSave?: boolean;
  titleLink?: string;
  title?: string;
  dictionary?: typeof data;
  data?: IProjectData;
  hideHeader?: boolean;
}

class EditorData {
  routeLink: string;
  routeTitle: string;
  hideHeader: boolean;
  dictionary: typeof data;

  constructor(routeLink: string, routeTitle: string, hideHeader = false, dictionary: typeof data = data) {
    this.routeLink = routeLink;
    this.routeTitle = routeTitle;
    this.hideHeader = hideHeader;
    this.dictionary = dictionary;
  }
}

class PluginStore {
  static FRAME_READY = 'frame_ready';

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
  static FRAME_PRO_SILVER_ACTION_SET_COMPONENTS = 'set_components';

  token = '';
  store: IMobileUIView;

  freeData: EditorData = new EditorData(ROUTE_ROOT, 'Facets UI');
  proData?: EditorData;
  origin?: string;

  @observable proMode = false;
  @observable plan: SubscriptionPlanEnum = SubscriptionPlanEnum.FREE;
  @observable data: EditorData;
  @observable componentsList: IObservableArray<IProject> = observable([]);

  @computed get components() {
    if(this.proMode) {
      if([SubscriptionPlanEnum.SILVER, SubscriptionPlanEnum.GOLD].includes(this.plan)) {
        return this.componentsList;
      } else {
        return []
      }
    }
    return OwnComponents.items;
  }

  constructor(store: IMobileUIView, urlQuery: string) {
    this.store = store;
    this.data = this.freeData;
    if (urlQuery.length) {
      this.store.setLoadingPlugin(true);
      this.fetchMode(urlQuery);
      when(() => !this.proMode || (this.proMode && this.plan === SubscriptionPlanEnum.START_UP), () => {
        this.fetchOwnComponents();
      });
    } else {
      when(() => App.loggedIn, () => {
        this.fetchOwnComponents();
      });
    }
  }

  init() {
    window.addEventListener('message', this.onMessage);
  }

  async fetchOwnComponents() {
    try {
      await OwnComponents.fetchItems();
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Own components error %s', err.message);
    }
  }

  async fetchMode(query: string) {
    const tokenData = query.split('=');
    this.token = tokenData[1];
    try {
      const response = await api(Apis.Main).plugin.subscription(this.token);
      this.init();
      this.setProMode(response.subscribed);
      this.setOrigin(response.origin);
      this.postMessage(PluginStore.FRAME_READY, {
        ios: this.store.ios,
        portrait: this.store.portrait,
        autoSave: this.store.autoSave
      });
      this.store.setLoadingPlugin(false);
    } catch (err) {
      console.error(err);
    }
  }

  @action setProMode(proMode: { planId: SubscriptionPlanEnum} | null) {
    this.proMode = proMode !== null;
    if(proMode !== null) {
      this.plan = proMode.planId;
    }
  }

  @action setComponents(components: IProject[]) {
    this.componentsList.replace(
      components.map(data => ProjectStore.from(data).update(data).setId(data.projectId).updateVersions(data.versions || []))
    )
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
    config.data && this.store.fromJSON(config.data);
    this.data = this.proData;
    this.store.dictionary && this.store.dictionary.setData(this.data.dictionary);
  }

  onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if(this.proMode) {
      switch(data[0]) {
        case PluginStore.FRAME_DATA_CONFIG:
          this.setConfig(data[1]);
          break;
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
          break;
        case PluginStore.FRAME_PRO_SILVER_ACTION_SET_COMPONENTS:
          this.setComponents(data[1]);
      }
    }
  };

  postMessage(action: string, message: string | { [key: string]: any }) {
    this.origin && this.origin !== 'none' && window.parent.postMessage(JSON.stringify([action, message]), this.origin);
  }

  dispose() {
    window.removeEventListener('message', this.onMessage);
  }
}

export default PluginStore;
