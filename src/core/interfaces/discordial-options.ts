import { Constructable } from "discord.js";
import { LoggerInterface } from "../logger/logger";

export interface DiscordialOptions {
    /** Custom Logger implementation. */
    readonly useLogger?: Constructable<LoggerInterface>;
}