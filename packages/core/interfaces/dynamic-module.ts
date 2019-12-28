import { Constructable } from "../../common/types";

export interface DynamicPlugin {
  usePlugin: Constructable<any>,
  config?: any,
}