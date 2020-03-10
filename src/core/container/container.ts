import { EventsManager } from "./events-manager";
import { PluginsManager } from "./plugins-manager";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { PluginWrapper } from "../types";

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
     * @param {PluginWrapper} wrappers - A list of plugins wrappers to be initialized.
     */
    public async startPlugins(wrappers: Promisify<PluginWrapper>[]): Promise<void> {
        this._pluginsManager.startPlugins(wrappers);
    }
}