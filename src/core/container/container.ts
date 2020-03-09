import { InjectablesManager } from "./injectables-manager";
import { DependencyManager } from "./dependency-manager";
import { Constructable } from "../../common/types";
import { ControllersManager } from "./controllers-manager";
import { PluginsManager } from "./plugins-manager";
import { PluginWrapper } from "../interfaces/plugin-wrapper";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";

/**
 * The Container registers plugins, instantiates them and prevents garbage
 * collection.
 */
export class Container {
    private readonly injectablesManager: InjectablesManager;
    private readonly dependencyManager:  DependencyManager;
    private readonly controllersManager: ControllersManager;
    private readonly pluginsManager:     PluginsManager;

    constructor(
        private readonly _logger: LoggerInterface
    ) {
        const { _l } = this;
        const injectMger  = new InjectablesManager();
        const dpsMger     = new DependencyManager(injectMger);
        const ctrlsMger   = new ControllersManager(_l, dpsMger);
        const pluginsMger = new PluginsManager(_l, ctrlsMger, injectMger);

        this.injectablesManager = injectMger;
        this.dependencyManager  = dpsMger;
        this.controllersManager = ctrlsMger;
        this.pluginsManager     = pluginsMger;
    }

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public async startPlugins(plugins: (PluginWrapper | Constructable<any>)[]): Promise<void> {
        const { _l } = this;
        log(_l.onDiscordialPluginsLoading());
        
        for (const plugin of plugins) {
            const { usePlugin, useConfig } = this.normalizePlugin<any>(plugin);
            await this.pluginsManager.resolve(usePlugin, usePlugin, useConfig);
        }
    }

    private normalizePlugin<T>(plugin: PluginWrapper | Constructable<T>): PluginWrapper {
        if ((plugin as PluginWrapper).usePlugin)
            return plugin as PluginWrapper;
        if ((plugin as Constructable<T>).prototype)
            return { usePlugin: plugin as Constructable<T> };
        throw new Error([
            `Invalid plugin provided.`,
            `You need to provide a constructable or a PluginWrapper.`
        ].join(' '));
    }

    /** Returns the controllers that have been instantiated. */
    public getControllers() {
        return this.controllersManager.controllers;
    }
}