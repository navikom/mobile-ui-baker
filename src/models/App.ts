import { action, computed, IReactionDisposer, observable, reaction, when } from 'mobx';
import { History } from 'history';
// interfaces
import { IFlow } from 'interfaces/IFlow';
import { IUser } from 'interfaces/IUser';
import { IRole } from 'interfaces/IRole';
// models
import { RoleStore } from 'models/Role/RoleStore';
import { UserStore } from 'models/User/UserStore';
import { Auth } from 'models/Auth/Auth';
import * as Constants from 'models/Constants';
import { Settings } from 'models/Settings';
import { Roles } from 'models/Role/RolesStore';
import { Events } from 'models/Event/EventsStore';
import { Regions } from 'models/Region/RegionsStore';
import CampaignViewStore from 'views/Campaigns/store/CampaignViewStore';
import { api, Apis } from 'api';

const debug = false;

export class AppStore implements IFlow {
  @observable role: IRole = RoleStore.defaultRole();
  @observable user: IUser | null = null;
  @observable navigationHistory?: History;
  userDisposer?: IReactionDisposer;
  anonymousDisposer: IReactionDisposer;

  @computed get loggedIn(): boolean {
    return this.user !== null && !Auth.anonymous;
  }

  @computed get sessionIsReady(): boolean {
    return this.loggedIn;
  }

  @computed get isAdmin(): boolean {
    return this.loggedIn && this.user!.isAdmin;
  }

  constructor() {
    when(() => this.user !== null, () => this.ifUserChanged());
    this.anonymousDisposer = reaction(() => {
      debug && console.log('this.anonymousDisposer', this.user, this.loggedIn, Auth.anonymous);
      return this.loggedIn;
    }, async (loggedIn: boolean) => {
      loggedIn && await Roles.fetch();
      this.ifUserChanged();
    });
  }

  @action
  async start() {
    await Auth.start();
    await Settings.fetch();
    Regions.addFakeRegions();
    when(() => this.loggedIn, async () => {
      await Regions.fetchItems();
    })

  }

  @action setUser(model: IUser) {
    if (!this.user) {
      this.user = UserStore.from(model);
    } else {
      this.user.update(model);
    }
  }

  stop(): void {
    Auth.stop();
    this.userDisposer && this.userDisposer();
    this.anonymousDisposer();
    CampaignViewStore.clear();
  }

  clear() {
    Events.clear();
  }

  ifUserChanged() {
    debug && console.log(2323232323, this.user);
    if (!this.navigationHistory || !this.user) {
      return;
    }
    if (Auth.anonymous) {
      this.clear();
      if (window.location.pathname.includes(Constants.LAYOUT_PANEL)) {
        this.navigationHistory.push(Constants.ROUTE_LOGIN);
      }
    }
  }

  async fetchUserSubscription() {
    if(!this.user) {
      return;
    }
    const userId = this.user.userId;
    const proPlan = await api(Apis.Main).user.fetchSubscription(userId);
    this.user.update({proPlan} as IUser);
  }

  setHistory(history: History) {
    this.navigationHistory = history;
  }

}

export const App = new AppStore();
