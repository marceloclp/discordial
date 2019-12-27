import { getBinding } from "../utils";

export const Inject = (token: Constructable) => (target: any, method: string, index: number) => {
  getBinding(target, true).setMethodParam(method, index, token);
}