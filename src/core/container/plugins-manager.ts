import { EventsManager } from "./events-manager";
import { ControllersManager } from "./controllers-manager";
import { DependenciesManager } from "./dependencies-manager";
import { Constructable } from "../../common/types";
import { LoggerInterface } from "../logger/logger";
import { DynamicPlugin } from "../interfaces/dynamic-plugin";
import { PluginWrapper } from "../types";
import { getBinding } from "../../common/util/getBinding";
import { BindingType } from "../../common/enums";
import { log } from "../utils/log";

export class PluginsManager {
    /** Used to check whether or not a plugin has already been instantiated. */
    private readonly _frequencyMap = new Map<Constructable<any>, boolean>();

    private readonly _ctrllsManager = new ControllersManager(this._, this._dpsManager);

    constructor(
        private readonly _logger: LoggerInterface,

        private readonly _dpsManager: DependenciesManager,
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public get eventsManager(): EventsManager {
        return this._ctrllsManager.eventsManager;
    }

    public exists(plugin: Constructable<any>): boolean {
        return this._frequencyMap.has(plugin);
    }

    /**
     * Guarantees the validity the plugin constructable and the uniqueness of
     * each plugin.
     * 
     * Maps the config object to the correct plugin constructable inside the
     * dependency manager, which will be injected into any controller that may
     * require it.
     * 
     * @param {Constructable} plugin - The plugin constructable.
     * @param {any}           config - A plugin configuration object.
     */
    public async resolve(plugin: Constructable<any>, config?: any): Promise<void> {
        const { _ } = this;

        if (getBinding(plugin).type !== BindingType.PLUGIN) {
            throw new Error([
                `${plugin.name} is not a plugin.`,
                `You probably appended the incorrect class to Discordial plugins.`,
            ].join(' '));
        }

        if (this.exists(plugin)) {
            throw new Error([
                `Plugin ${plugin.name} already has been created.`,
                `You are probably declarating the plugin twice.`,
            ].join(' '));
        }

        log(_.onPluginLoading(plugin.name));

        this._frequencyMap.set(plugin, true);
        if (config) {
            DependenciesManager.register(plugin, plugin);
            this._dpsManager.setInstance(plugin, config);
        }

        const { controllers } = getBinding(plugin).plugin;
        for (const controller of controllers)
            await this._ctrllsManager.resolve(controller, plugin);
    }

    /**
     * Normalizes the structure of a plugin into a dynamic plugin format.
     * 
     * @param {PluginWrapper} plugin - The plugin structure to be normalized.
     * 
     * @returns The plugin as a Plugin Wrapper.
     */
    public normalizePlugin(plugin: PluginWrapper): DynamicPlugin {
        if (typeof plugin === "object")
            return plugin as DynamicPlugin;
        
        if (typeof plugin === "function")
            return { usePlugin: plugin as Constructable<any> };

        throw new Error([
            `Invalid plugin provided.`,
            `You need to provide a constructable or a PluginWrapper.`
        ].join(' '));
    }
}