import { PluginsManager } from "./plugins-manager";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { PluginWrapper } from "../types";
import Discord from "discord.js";

/**
 * The Container registers plugins, instantiates them and prevents garbage
 * collection.
 */
export class Container {
    private readonly _dpsManager     = new DependenciesManager(this._);
    private readonly _pluginsManager = new PluginsManager(this._, this._dpsManager);

    constructor(
        private readonly _logger: LoggerInterface
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    /**
     * Initializes a list of plugins.
     * 
     * @param {PluginWrapper} wrappers - A list of plugins wrappers to be initialized.
     */
    public async startPlugins(wrappers: Promisify<PluginWrapper>[]): Promise<void> {
        await this._pluginsManager.startPlugins(wrappers);
    }

    /**
     * Binds the controllers methods to the Discord client event listeners.
     * 
     * @param {Discord.Client} client - The Discord client instance.
     */
    public bindEvents(client: Discord.Client): void {
        this._pluginsManager.eventsManager.bindEvents(client);
    }
}