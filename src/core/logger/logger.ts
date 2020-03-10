import _ from "chalk";
import { DiscordialLoggerInterface } from "./discordial-logger";
import { PluginLoggerInterface } from "./plugin-logger";
import { ControllerLoggerInterface } from "./controller-logger";
import { EventLoggerInterface } from "./event-logger";

export interface LoggerInterface extends
    DiscordialLoggerInterface,
    PluginLoggerInterface,
    ControllerLoggerInterface,
    EventLoggerInterface {}

export class Logger implements LoggerInterface {
    private readonly headerLength = 50;

    private readonly symbols = {
        circle:    '●',
        dropdown:  '⤷',
        diamond:   '⬥',
        arrow:     '⇒',
    };

    private readonly styles = {
        symbol: _.rgb(255, 230, 70),
        timestamp: _.rgb(100, 120, 240).bgWhiteBright.bold,
        state: _.rgb(240, 90, 140),
        plugin: _.rgb(240, 210, 90).bold,
        provider: _.rgb(250, 180, 80).bold,
        controller: _.rgb(85, 240, 180).bold,
        event: _.rgb(15, 180, 255).bold,
        header: _.bgRgb(70, 190, 105),
    };

    private timestamp(): string {
        const time = new Date().toTimeString().split(' ')[0];
        return this.styles.timestamp(`[${time}]`);
    }

    private indent(level = 1): string {
        return "    ".repeat(level);
    }

    private header(msg: string, _: CallableFunction): string {
        const rawMsg = msg.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''
        );
        const spaceFill = " ".repeat(this.headerLength - rawMsg.length);
        return _(msg + spaceFill);
    }

    public onReady(): string {
        return [
            '\n' +
            this.timestamp(),
            this.header([
                _.bold(`Discordial is now ready and listening!`),
            ].join(' '), this.styles.header),
            '\n',
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
            this.header([
                _.bold(`Initializing`),
                _.yellow.bold(numberOfPlugins),
                _.bold(`plugin(s)`),
                `...`,
            ].join(' '), this.styles.header) + '\n',
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
            _.greenBright.bold(this.symbols.diamond),
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

    public onControllerMapping(controllerName: string, numOfMethods: number): string {
        return [
            this.timestamp(),
            this.indent(2),
            this.styles.symbol(this.symbols.dropdown),
            `Mapping`,
            _.red.bold(numOfMethods),
            `method(s)`,
        ].join(' ');
    }

    public onEventsBinding(numofMappedEvents: number, numOfTotalEvents: number): string {
        return [
            this.timestamp(),
            this.header([
                _.bold(`Binding`),
                _.rgb(0, 0, 0).bold(numofMappedEvents) +
                _.black.bold(`/`) +
                _.black.bold(numOfTotalEvents),
                _.bold(`event(s) ...`),
            ].join(' '), this.styles.header) + '\n',
        ].join(' ');
    }

    public onEventBinding(event: string, numOfMethods: number): string {
        return [
            this.timestamp(),
            this.styles.event(`[${event}]`),
            _.bold(this.symbols.arrow + ' '),
            _.green.bold(numOfMethods),
            `method(s) bound`,
        ].join(' ');
    }
}