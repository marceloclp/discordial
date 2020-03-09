import { Logger, LoggerInterface } from "./logger/logger";
import { Container } from "./container/container";
import { Constructable } from "../common/types";
import { PluginWrapper } from "./interfaces/plugin-wrapper";
import { log } from "./utils/log";

export interface DiscordialOptions {
    readonly plugins?: (PluginWrapper | Constructable<any>)[],

    readonly useLogger?: Constructable<LoggerInterface>;
}

export class Discordial {
    private readonly _logger: LoggerInterface;

    /** The IoC container that will manage the dependencies. */
    private readonly _container: Container;

    constructor(
        private readonly _token: string,
        options: DiscordialOptions,
    ) {
        console.clear();

        const { useLogger, plugins } = options;
        this._logger    = new (useLogger || Logger)();
        this._container = new Container(this._logger);

        this.start(plugins || []);
    }

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    private get token(): string {
        return this._token;
    }

    private async start(plugins: (PluginWrapper | Constructable<any>)[]): Promise<void> {
        const { _l, token } = this;
        
        log(_l.onDiscordialStart(token));

        await this._container.startPlugins(plugins);
    }
}