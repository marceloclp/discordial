import { getBinding } from "../utils";
import { Constructable } from "../types";

export const Inject = (token: Constructable<any>) => (target: any, method: string, index: number) => {
  getBinding(target, true).setMethodParam(method, index, token);
}