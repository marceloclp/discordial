import { DynamicPlugin } from "./interfaces/dynamic-plugin";
import { Constructable } from "discord.js";

export type PluginWrapper = DynamicPlugin | Constructable<any>;