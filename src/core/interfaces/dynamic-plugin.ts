import { Constructable } from "../../common/types";

export interface DynamicPlugin {
    readonly usePlugin: Constructable;

    readonly useConfig?: any;

    readonly providers?: Constructable[];
}