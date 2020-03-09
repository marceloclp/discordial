import { Logger, LoggerInterface } from "./logger/logger";
import { Container } from "./container/container";
import { log } from "./utils/log";
import { PluginWrapper } from "./types";
import { DiscordialOptions } from "./interfaces/discordial-options";

const defaultOptions: DiscordialOptions = {
    useLogger: Logger,
};

export class Discordial {
    private readonly _logger: LoggerInterface;

    /** The IoC container that will manage the dependencies. */
    private readonly _container: Container;

    constructor(
        private readonly _token: string,
        plugins: (PluginWrapper | Promise<PluginWrapper>)[],
        options = defaultOptions,
    ) {
        console.clear();

        const { useLogger } = options;
        this._logger    = new (useLogger || Logger)();
        this._container = new Container(this._logger);

        this.start(plugins);
    }

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    private get token(): string {
        return this._token;
    }

    private async start(plugins: (PluginWrapper | Promise<PluginWrapper>)[]): Promise<void> {
        const { _l, token } = this;
        
        log(_l.onDiscordialStart(token));
        
        await this._container.startPlugins(plugins);
    }
}