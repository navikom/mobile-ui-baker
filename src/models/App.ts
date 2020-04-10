import { action, computed, IReactionDisposer, observable, reaction, when } from "mobx";
import { History } from "history";

// interfaces
import { IFlow } from "interfaces/IFlow";
import { IUser } from "interfaces/IUser";
import { IRole } from "interfaces/IRole";

// models
import { RoleStore } from "models/Role/RoleStore.ts";
import { UserStore } from "models/User/UserStore.ts";
import { Auth } from "models/Auth/Auth.ts";
import * as Constants from "models/Constants.ts";
import { Settings } from "models/Settings";
import { Roles } from "models/Role/RolesStore";
import { Events } from "models/Event/EventsStore";
import { Regions } from "models/Region/RegionsStore";
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import { OwnProjects } from "models/Project/OwnProjectsStore";
import { OwnComponents } from "models/Project/OwnComponentsStore";

export class AppStore implements IFlow {
  @observable role: IRole = RoleStore.defaultRole();
  @observable user: IUser | null = null;
  @observable navigationHistory?: History;
  private redirectRoute?: string;
  userDisposer?: IReactionDisposer;
  anonymousDisposer: IReactionDisposer;

  @computed get loggedIn(): boolean {
    return this.user !== null && !Auth.anonymous;
  }

  @computed get sessionIsReady(): boolean {
    return this.loggedIn;
  }

  constructor() {
    when(() => this.user !== null, () => this.ifUserChanged());
    this.anonymousDisposer = reaction(() => {
      console.log('this.anonymousDisposer', this.user, this.loggedIn, Auth.anonymous);
      return this.loggedIn;
    }, async (loggedIn: boolean) => {
      loggedIn && await Roles.fetch();
      this.ifUserChanged();
    });
    // when(() => Regions.allFetched, () => SegmentRegionViewStore.loadData());
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
    OwnProjects.clear();
    OwnComponents.clear();
  }

  ifUserChanged() {
    console.log(2323232323, this.user);
    if (!this.navigationHistory || !this.user) {
      return;
    }
    if (Auth.anonymous) {
      this.clear();
      if (window.location.pathname.includes(Constants.PANEL_ROUTE)) {
        this.redirectRoute = window.location.pathname;
        this.navigationHistory.push(Constants.LOGIN_ROUTE);
      } else {
        if(!window.location.pathname.includes(Constants.EDITOR_ROUTE) && !window.location.pathname.includes(Constants.PROJECTS_ROUTE)) {
          this.navigationHistory.push(Constants.ROOT_ROUTE);
        }
      }
    } else {
      console.log(757575575757, this.redirectRoute, window.location.pathname, window.location.pathname.includes(Constants.PANEL_ROUTE));
      if(this.redirectRoute) {
        this.navigationHistory.replace(this.redirectRoute);
        this.redirectRoute = undefined;
        return;
      }
      if (!window.location.pathname.includes(Constants.PANEL_ROUTE)) {
        this.navigationHistory.push(Constants.DASHBOARD_ROUTE);
      }
    }
  }

  setHistory(history: History) {
    this.navigationHistory = history;
  }

}

export const App = new AppStore();
