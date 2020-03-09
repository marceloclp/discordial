import { Constructable, Instance } from "../../common/types";
import { getBinding } from "../../common/util/getBinding";
import { ControllersManager } from "./controllers-manager";
import { BindingType } from "../../common/enums";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";
import { InjectablesManager } from "./injectables-manager";

type PluginKey = Constructable<any> | string | Symbol;

export class PluginsManager {
    /** Maps a plugin token to its constructable. */
    private readonly refs = new Map<PluginKey, Constructable<any>>();

    /** Maps config objects to plugins. */
    private readonly configs = new Map<PluginKey, any>();

    constructor(
        private readonly _logger: LoggerInterface,

        private readonly controllersManager: ControllersManager,

        private readonly injectablesManager: InjectablesManager,
    ) {}

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public exists(token: PluginKey): boolean {
        return this.refs.has(token);
    }

    public getConfig(token: PluginKey): any {
        return this.configs.get(token);
    }

    /**
     * A plugin is resolved when its controllers are instantiated.
     */
    public async resolve(token: PluginKey, plugin: Constructable<any>, config?: any): Promise<void> {
        const { _l } = this;

        if (getBinding(plugin).type !== BindingType.PLUGIN) {
            throw new Error([
                `${plugin.name} is not a plugin.`,
                `You probably appended the incorrect class to Discordial plugins.`,
            ].join(' '));
        }

        if (this.exists(token)) {
            throw new Error([
                `Plugin ${plugin.name} already has been created.`,
                `You are probably declarating the plugin twice.`,
            ].join(' '));
        }

        log(_l.onPluginLoading(plugin.name));

        this.refs.set(token, plugin);
        this.configs.set(token, config);

        if (config) {
            this.injectablesManager.setInstance(token, config);
        }

        const { controllers } = getBinding(plugin).plugin;
        for (const controller of controllers)
            await this.controllersManager.resolve(controller, plugin);
    }
}