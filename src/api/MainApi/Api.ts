import { ApiBase } from "api/ApiBase";
import { HttpBase } from "api/HttpBase";
import { ILoginResult } from "interfaces/ILoginResult";

class User extends HttpBase {
  constructor() {
    super("users");
  }

  signup(email: string, password: string): Promise<ILoginResult> {
    const body = {
      email: email,
      password: password,
      grantType: "password"
    };
    return this.fetchData("post", "sign-up", body);
  }

  anonymous(): Promise<ILoginResult> {
    return this.fetchData("post", "anonymous");
  }

  login(email: string, password: string): Promise<ILoginResult> {
    const body = {
      email: email,
      password: password,
      grantType: "password"
    };
    return this.fetchData("post", "login", body);
  }

  logout(): Promise<null> {
    return this.fetchData("get", "logout");
  }

  refresh(): Promise<ILoginResult> {
    const body = {
      grantType: "refresh"
    };
    return this.fetchData("post", "login", body);
  }

  changePassword(password: string, newPassword: string) {
    return this.fetchData("post", "change-password", { password, newPassword });
  }

  updateRole(userId: number, roleId: number) {
    return this.fetchData("post", `${userId}/update-role/${roleId}`);
  }
}

class AEvent extends HttpBase {
  constructor() {
    super("events");
  }
}

class App extends HttpBase {
  constructor() {
    super("apps");
  }

  update(appId: number, data: any) {
    return this.fetchData("put", appId.toString(), data, undefined, [
      "Content-Type",
      "Accept"
    ]);
  }

  sortImages(appId: number, data: { imageId: number; sort: number }[]) {
    return this.fetchData("put", `${appId}/images/sort`, data);
  }

  deleteAppImage(appId: number, imageId: number) {
    return this.fetchData("delete", `${appId}/image/${imageId}`);
  }
}

class Setting extends HttpBase {
  constructor() {
    super("settings");
  }

  getData() {
    return this.fetchData("get");
  }
}

class PixartPicture extends HttpBase {
  constructor() {
    super("pixart-pictures");
  }

  save(data: any) {
    return this.fetchData("post", undefined, data, undefined, [
      "Content-Type",
      "Accept"
    ]);
  }
}

class Roles extends HttpBase {
  constructor() {
    super("roles");
  }
}

class Segments extends HttpBase {
  constructor() {
    super("segments");
  }
}

class Campaign extends HttpBase {
  constructor() {
    super("campaigns");
  }
}

class Region extends HttpBase {
  constructor() {
    super("regions");
  }
}

export default class Api extends ApiBase {

  get user(): User {
    return new User();
  }

  get event(): AEvent {
    return new AEvent();
  }

  get app(): App {
    return new App();
  }

  get setting(): Setting {
    return new Setting();
  }

  get pixartPicture(): PixartPicture {
    return new PixartPicture();
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
}
