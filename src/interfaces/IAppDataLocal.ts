import { IErrors } from "interfaces/IErrors";

export interface IAppDataLocal extends IErrors {
  successRequest: boolean;
  fetching: boolean;
  open: boolean;

  setSuccessRequest(value: boolean): void;
  setFetching(value?: boolean): void;
  setTimeOut(cb: () => void, time: number): void;
}
