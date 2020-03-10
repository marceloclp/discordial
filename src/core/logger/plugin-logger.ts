export interface PluginLoggerInterface {
    /**
     * It's called once, when Discordial starts loading plugins.
     */
    onPluginsStart?: (numberOfPlugins: number) => string;

    /**
     * It's called once for each plugin, when it starts loading.
     */
    onPluginStart?: (pluginName: string, useConfig: boolean) => string;

    /**
     * It's called once for each plugin, once its providers, if any, start loading.
     */
    onPluginProvidersStart?: (pluginName: string, providers: { name: string }[]) => string;

    /**
     * It's called once of each of the plugins' providers.
     */
    onPluginProviderStart?: (pluginName: string, providerName: string) => string;

    /**
     * It's called once for each plugin, once its controllers, if any, start loading.
     */
    onPluginControllersStart?: (pluginName: string, controllers: { name: string }[]) => string;

    /**
     * It's called once for each plugin, once its providers and controllers have finished loading.
     */
    onPluginFinish?: (pluginName: string) => string;
}