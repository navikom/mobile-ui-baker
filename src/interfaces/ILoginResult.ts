import { IUser } from "interfaces/IUser";

export interface ILoginResult {
  expires: Date;
  anonymous: boolean;
  user: IUser;
}
