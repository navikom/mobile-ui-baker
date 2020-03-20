import MainApi from "api/MainApi/Api";
import { ErrorHandler } from "utils/ErrorHandler";

export enum Apis {
  Main,
}
export function api(type: Apis) {
  if (type === Apis.Main) {
      return new MainApi();
  }
  throw new ErrorHandler('There is not Api type provided');
}
