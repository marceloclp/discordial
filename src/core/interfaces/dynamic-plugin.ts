import { Constructable } from "discord.js";

export interface DynamicPlugin {
    readonly usePlugin: Constructable<any>;

    readonly useConfig?: any;
}