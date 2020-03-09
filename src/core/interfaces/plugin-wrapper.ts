import { Constructable } from "../../common/types";

export interface PluginWrapper {
    readonly usePlugin: Constructable<any>;

    readonly useConfig?: any;
}