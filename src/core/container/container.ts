import { EventsManager } from "./events-manager";
import { PluginsManager } from "./plugins-manager";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { PluginWrapper } from "../types";
import { log } from "../utils/log";

/**
 * The Container registers plugins, instantiates them and prevents garbage
 * collection.
 */
export class Container {
    private readonly _dpsManager = new DependenciesManager(this._);
    private readonly _pluginsManager = new PluginsManager(this._, this._dpsManager);

    constructor(
        private readonly _logger: LoggerInterface
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public get eventsManager(): EventsManager {
        return this._pluginsManager.eventsManager;
    }

    /**
     * Initializes a list of plugins.
     * 
     * @param {PluginWrapper} plugins - A list of plugins to be initialized.
     */
    public async startPlugins(plugins: (PluginWrapper | Promise<PluginWrapper>)[]): Promise<void> {
        log(this._.onDiscordialPluginsLoading());
        
        for (const plugin of plugins) {
            const { usePlugin, useConfig } = this
                ._pluginsManager
                .normalizePlugin(await plugin as PluginWrapper);
            await this._pluginsManager.resolve(usePlugin, useConfig);
        }
    }
}