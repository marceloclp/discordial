import _ from "chalk";
import { DiscordialLoggerInterface } from "./discordial-logger";
import { PluginLoggerInterface } from "./plugin-logger";
import { ControllerLoggerInterface } from "./controller-logger";
import { InjectableLoggerInterface } from "./injectable-logger";

export interface LoggerInterface extends
    DiscordialLoggerInterface,
    PluginLoggerInterface,
    ControllerLoggerInterface,
    InjectableLoggerInterface {}

enum Symbols {
    dropdown_arrow = '⤷',
    destroy = '💣',
    starred_circle = '✪',
    diamond = '⬥',
    checkmark = '🗸',
};


export class Logger implements LoggerInterface {
    private format(symbol: Symbols, log: string | string[], level = 0): string {
        const indent = "    ".repeat(level);
        const msg = Array.isArray(log) ? log.join('') : log;
        return indent + _.bold(symbol) + ' ' + msg;
    }

    public onReady(): string {
        return this.format(Symbols.checkmark, [
            ` Discordial is ready!`,
        ], 1);
    }

    public onDiscordialStart(token: string): string {
        return this.format(Symbols.starred_circle, [
            ` Configuring Discordial with `,
            _.bold.red('Token<'),
            _.bold.rgb(250, 170, 170)(token),
            _.bold.red('>'),
            `...`,
        ]);
    }

    public onDiscordialPluginsLoading(): string {
        return this.format(Symbols.dropdown_arrow, [
            _.bold.magenta(`Initializing Plugins...`)
        ], 1);
    }

    public onPluginLoading(pluginName: string): string {
        return this.format(Symbols.dropdown_arrow, [
            `Loading `,
            _.bold.blueBright(pluginName),
        ], 2);
    }

    public onControllerInitialization(controllerName?: string): string {
        return this.format(Symbols.dropdown_arrow, [
            `Initializing `,
            _.bold.green(controllerName),
        ], 3);
    }

    public onControllerMapping(controllerName?: string, methods?: { name: string, event: string }[]): string {
        return this.format(Symbols.diamond, [
            ` Mapping `,
            _.red((methods as []).length),
            ` method(s)`,
        ], 4);
    }

    public onControllerFinish(): string {
        return this.format(Symbols.checkmark, [
            `Finished!`,
        ], 4);
    }
}