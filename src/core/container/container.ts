import { DependenciesManager } from "./dependencies-manager";
import { Constructable } from "../../common/types";
import { PluginsManager } from "./plugins-manager";
import { PluginWrapper } from "../interfaces/plugin-wrapper";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";
import { EventsManager } from "./events-manager";

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

    public async startPlugins(plugins: (PluginWrapper | Constructable<any>)[]): Promise<void> {
        const { _: _l } = this;
        log(_l.onDiscordialPluginsLoading());
        
        for (const plugin of plugins) {
            const { usePlugin, useConfig } = this._pluginsManager.normalizePlugin(plugin);
            await this._pluginsManager.resolve(usePlugin, useConfig);
        }
    }
}