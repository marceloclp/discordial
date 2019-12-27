import Discord from "discord.js";
import { DiscordEvents } from "../common/enums";
import { uniqueid, getBinding } from "../common/utils";
import { EventBinder } from "./event-binder";
import { Injector } from "./injector";
import { Logger } from "./logger";

interface DiscordialConfiguration {
  plugins: (Constructable | DynamicPlugin)[];
}

const defaultConfiguration: DiscordialConfiguration = {
  plugins: [],
};

/**
 * Responsible for initializing the discord bot and the IoC container for the plugins.
 */
export class Discordial {
  /** Responsible for instantiating dependencies. */
  private readonly _injector = new Injector();

  /** Attaches the plugins methods to Discord events. */
  private readonly _eventBinder = new EventBinder();

  /** The Discord client. */
  private readonly _client = new Discord.Client();

  /** Plugins instances are stored to prevent garbage collection. */
  private readonly _instances: InstanceMap = new Map();

  constructor(
    private readonly _token: string,
    config = defaultConfiguration
  ) {
    Logger.start(this._token);
    this.loadPlugins(config.plugins);
    this._eventBinder.attachEvents(this._instances, this._client, this._injector);
    this.connect();
  }

  /**
   * Loads the plugins.
   * 
   * @param plugins Array of plugins or plugins wrappers to be loaded.
   */
  private loadPlugins(plugins: (Constructable | DynamicPlugin)[]): void {
    Logger.startLoadingPlugins();

    const pluginsList = new Map<Function, boolean>();
    for (const plugin of plugins as any[]) {
      const usePlugin = plugin.usePlugin || plugin;
      const config = plugin.config;
      const id = uniqueid();
      this.loadPlugin(usePlugin, config, id, pluginsList);
    }
  }

  /**
   * Injects dependencies and instantiates a plugin.
   * 
   * @param usePlugin The plugin constructor.
   * @param config A plugin may have a configuration object if it's a dynamic plugin.
   * @param id A unique id used to map the plugin instance.
   * @param pluginsList A map of instantiated plugins used to verify if a static plugin is not being instantiated twice.
   */
  private loadPlugin(
    usePlugin: Constructable,
    config: any,
    id: string,
    pluginsList: Map<Function, boolean>
  ): void {
    Logger.loadingPlugin(usePlugin.name, !!(config));

    // Registering a duplicate static plugin is not allowed.
    if (pluginsList.has(usePlugin) && !config)
      throw new Error("Duplicate static plugin.");
    if (!config) pluginsList.set(usePlugin, true);

    const dps = getBinding(usePlugin).dependencies;
    const resolvedDps = this._injector.resolve(dps, undefined, true);
    this._instances.set(id as string, new usePlugin(...resolvedDps, config));
  }

  private connect(): void {
    this._client.on(DiscordEvents.READY, Logger.connected);
    this._client.login(this._token);
  }
}; 