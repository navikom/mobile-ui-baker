import { ApiBase } from 'api/ApiBase';
import { HttpBase } from 'api/HttpBase';
import { ILoginResult } from 'interfaces/ILoginResult';
import AccessEnum from '../../enums/AccessEnum';

class User extends HttpBase {
  constructor() {
    super('users');
  }

  signup(email: string, password: string): Promise<ILoginResult> {
    const body = {
      email: email,
      password: password,
      grantType: 'password'
    };
    return this.fetchData('post', 'sign-up', body);
  }

  anonymous(): Promise<ILoginResult> {
    return this.fetchData('post', 'anonymous');
  }

  login(email: string, password: string): Promise<ILoginResult> {
    const body = {
      email: email,
      password: password,
      grantType: 'password'
    };
    return this.fetchData('post', 'login', body);
  }

  logout(): Promise<null> {
    return this.fetchData('get', 'logout');
  }

  refresh(): Promise<ILoginResult> {
    const body = {
      grantType: 'refresh'
    };
    return this.fetchData('post', 'login', body);
  }

  changePassword(password: string, newPassword: string) {
    return this.fetchData('post', 'change-password', { password, newPassword });
  }

  updateRole(userId: number, roleId: number) {
    return this.fetchData('post', `${userId}/update-role/${roleId}`);
  }

  forgot(email: string) {
    return this.fetchData('post', 'forgot', { email });
  }

  reset(token: string, password: string, repeatPassword: string) {
    return this.fetchData('post', `reset/${token}`, { password, repeatPassword });
  }

  fetchSubscription() {
    return this.fetchData('get', 'payment-subscription');
  }

  subscriptionsFullData() {
    return this.fetchData('get', 'subscriptions-full-data');
  }

  sendEmailMessage(name: string, email: string, message: string) {
    return this.fetchData('post', 'send-email', {name, email, message});
  }
}

class AEvent extends HttpBase {
  constructor() {
    super('events');
  }
}

class Setting extends HttpBase {
  constructor() {
    super('settings');
  }

  getData() {
    return this.fetchData('get');
  }
}

class Roles extends HttpBase {
  constructor() {
    super('roles');
  }
}

class Segments extends HttpBase {
  constructor() {
    super('segments');
  }
}

class Campaign extends HttpBase {
  constructor() {
    super('campaigns');
  }
}

class Region extends HttpBase {
  constructor() {
    super('regions');
  }
}

class Payment extends HttpBase {
  constructor() {
    super('payments');
  }

  getBySubscriptionId(subscriptionId: number) {
    return this.fetchData('get', `subscription/${subscriptionId}`);
  }
}

class Paddle extends HttpBase {
  constructor() {
    super('paddle');
  }

  setPlan(subscriptionId: number, planId: number) {
    return this.fetchData('post', `subscription/${subscriptionId}/plan/${planId}`);
  }
}

class Plugin extends HttpBase {
  constructor() {
    super('plugin');
  }

  subscription(token: string) {
    return this.fetchData('get', `subscription/${token}`);
  }
}

export class Project extends HttpBase {
  constructor() {
    super('projects');
  }

  update(projectId: number, data: any) {
    return this.fetchData('put', projectId.toString(), data, undefined, ['Content-Type', 'Accept']);
  }

  sortImages(projectId: number, data: { imageId: number; sort: number }[]) {
    return this.fetchData('put', `${projectId}/images/sort`, data);
  }

  deleteImage(projectId: number, imageId: number) {
    return this.fetchData('delete', `${projectId}/image/${imageId}`);
  }

  access(projectId: number, access: AccessEnum) {
    return this.fetchData('post', `${projectId}/access/${access}`);
  }
}

class Control extends HttpBase {
  constructor() {
    super('controls');
  }

  update(controlId: number, data: any) {
    return this.fetchData('put', controlId.toString(), data, undefined, ['Content-Type', 'Accept']);
  }

  deleteImage(controlId: number, imageId: number) {
    return this.fetchData('delete', `${controlId}/image/${imageId}`);
  }
}

class Component extends HttpBase {
  constructor() {
    super('components');
  }

  update(componentId: number, data: any) {
    return this.fetchData('put', componentId.toString(), data, undefined, ['Content-Type', 'Accept']);
  }

  deleteImage(componentId: number, imageId: number) {
    return this.fetchData('delete', `${componentId}/image/${imageId}`);
  }
}

export default class Api extends ApiBase {

  get user(): User {
    return new User();
  }

  get event(): AEvent {
    return new AEvent();
  }

  get setting(): Setting {
    return new Setting();
  }

  get role(): Roles {
    return new Roles();
  }

  get segment(): Segments {
    return new Segments();
  }

  get campaign(): Campaign {
    return new Campaign();
  }

  get region(): Region {
    return new Region();
  }

  get project(): Project {
    return new Project();
  }

  get control(): Control {
    return new Control();
  }

  get component(): Component {
    return new Component();
  }

  get payment(): Payment {
    return new Payment();
  }

  get plugin(): Plugin {
    return new Plugin();
  }

  get paddle(): Paddle {
    return new Paddle();
  }
}
