import Discord from "discord.js";
import { Container } from "./container/container";
import { PluginWrapper } from "./types";
import { Logger, LoggerInterface } from "./logger/logger";
import { DiscordialOptions } from "./interfaces/discordial-options";
import { DiscordEvents } from "../common/enums";
import { log } from "./utils/log";

const defaultOptions: DiscordialOptions = {
    useLogger: Logger,
};

export class Discordial {
    private readonly _logger: LoggerInterface;

    /** The IoC container that will manage the dependencies. */
    private readonly _container: Container;

    private readonly _discordClient = new Discord.Client();

    constructor(
        /** Discord BOT token retrieved from the Discord developer dashboard. */
        private readonly _token: string,

        /** List of plugins to be initialized with the Discordial instance. */
        plugins: (PluginWrapper | Promise<PluginWrapper>)[],

        /** Additional optional configuration for Discordial. */
        options = defaultOptions,
    ) {
        console.clear();

        const { useLogger } = options;
        this._logger    = new (useLogger || Logger)();
        this._container = new Container(this._logger);

        this.start(plugins);
    }

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    private get container(): Container {
        return this._container;
    }

    private get client(): Discord.Client {
        return this._discordClient;
    }

    private get token(): string {
        return this._token;
    }

    /**
     * The process of starting Discordial is separated into two proccesses:
     *   1) Initiliazing plugins and its dependencies.
     *   2) Connecting to the Discord API.
     * 
     * @param {PluginWrapper} plugins - The list of plugins to be initialized.
     */
    private async start(plugins: (PluginWrapper | Promise<PluginWrapper>)[]): Promise<void> {
        log(() => this._.onDiscordialStart(this.token));
        
        await this.container.startPlugins(plugins);
        await this.connect();
    }

    /**
     * Connects the Discordial to the Discord API.
     */
    private async connect(): Promise<void> {
        const { client, token, container } = this;

        client.on(DiscordEvents.READY, () => {
            log(() => this._.onReady());
        });
        container.bindEvents(client);

        await client.login(token);
    }
}