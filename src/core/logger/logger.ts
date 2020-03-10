import _ from "chalk";
import { DiscordialLoggerInterface } from "./discordial-logger";
import { PluginLoggerInterface } from "./plugin-logger";
import { ControllerLoggerInterface } from "./controller-logger";

export interface LoggerInterface extends
    DiscordialLoggerInterface,
    PluginLoggerInterface,
    ControllerLoggerInterface {}

export class Logger implements LoggerInterface {
    private readonly symbols = {
        circle:    '●',
        dropdown:  '⤷',
        diamond:   '⬥',
        checkmark: '🗸',
        arrow:     '⇒',
    };

    private readonly styles = {
        symbol: _.rgb(255, 230, 70),
        timestamp: _.rgb(100, 120, 240).bgWhiteBright.bold,
        state: _.rgb(240, 90, 140),
        plugin: _.rgb(240, 210, 90).bold,
        provider: _.rgb(250, 180, 80).bold,
        controller: _.rgb(85, 240, 180).bold,
    };

    private timestamp(): string {
        const time = new Date().toTimeString().split(' ')[0];
        return this.styles.timestamp(`[${time}]`);
    }

    private indent(level = 1): string {
        return "    ".repeat(level);
    }

    public onReady(): string {
        return [
            this.timestamp(),
            _.bold(`Discordial is ready!\n`),
        ].join(' ');
    }

    public onDiscordialStart(token: string): string {
        return [
            '\n' +
            this.timestamp(),
            _.green.bold(`Starting Discordial @`),
            _.redBright.bold(token) + '\n',
        ].join(' ');
    }

    public onPluginsStart(numberOfPlugins: number): string {
        return [
            this.timestamp(),
            _.bold(`Initializing`),
            _.yellow.bold(numberOfPlugins),
            _.bold(`plugin(s)`),
            `...\n`,
        ].join(' ');
    }

    public onPluginStart(pluginName: string, useConfig: boolean): string {
        return [
            this.timestamp(),
            `Starting`,
            this.styles.plugin(pluginName) +
            this.styles.state(`<${ useConfig ? 'dynamic' : 'static' }>`),
        ].join(' ');
    }

    public onPluginProvidersStart(pluginName: string, providers: { name: string }[]): string {
        return [
            this.timestamp(),
            this.indent(),
            this.styles.symbol(this.symbols.diamond),
            `Loading`,
            _.bold.green(providers.length),
            this.styles.provider(`provider(s)`),
            `...`,
        ].join(' ');
    }

    public onPluginProviderStart(pluginName: string, providerName: string): string {
        return [
            this.timestamp(),
            this.indent(2),
            this.symbols.dropdown,
            `Injecting`,
            this.styles.provider(providerName),
            `...`
        ].join(' ');
    }

    public onPluginControllersStart(pluginName: string, controllers: { name: string }[]): string {
        return [
            this.timestamp(),
            this.indent(),
            this.styles.symbol(this.symbols.diamond),
            `Loading`,
            _.bold.green(controllers.length),
            this.styles.controller(`controller(s)`),
            `...`,
        ].join(' ');
    }

    public onPluginFinish(pluginName: string): string {
        return [
            this.timestamp(),
            this.indent(),
            this.styles.symbol(this.symbols.diamond),
            `Loaded successfuly!\n`,
        ].join(' ');
    }

    public onControllerStart(controllerName: string, numOfDps: number): string {
        return [
            this.timestamp(),
            this.indent(2),
            this.styles.symbol(this.symbols.dropdown),
            `Starting`,
            this.styles.controller(controllerName) +
            this.styles.state(`<${numOfDps}>`),
        ].join(' ');
    }

    public onControllerMapping(numOfMethods: number): string {
        return [
            this.timestamp(),
            this.indent(2),
            this.styles.symbol(this.symbols.dropdown),
            `Mapping`,
            _.red.bold(numOfMethods),
            `method(s)`,
        ].join(' ');
    }
}