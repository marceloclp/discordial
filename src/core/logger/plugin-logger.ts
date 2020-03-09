export interface PluginLoggerInterface {
    /**
     * It's called once when a plugin starts its initialization process.
     * 
     * The loggeable lifecycle of a plugin is:
     *   1) Instantiate the controllers.
     * 
     */
    onPluginInitialization?: (pluginName: string) => string;

    /**
     * It's called each time the plugin's controller starts its initialization.
     */
    onPluginLoading?: (pluginName: string) => string;

    /**
     * It's called once when a plugin's loggeable lifecycle is over.
     */
    onPluginFinish?: (pluginName: string) => string;

    /**
     * It's called once when the Discordial is disconnected.
     */
    onPluginDestroy?: (pluginName: string) => string;
}

/*export class PluginLogger implements PluginLoggerInterface {
    private format(log: string): string {
        return SYMBOLS.dropdown_arrow + log;
    }

    public onInitialization(pluginName: string): string {
        return this.format(`Starting ${pluginName}.`);
    }

    public onLoading(pluginName: string, controllerName: string): string {
        return this.format(`Loading ${controllerName}.`);
    }

    public onFinish(pluginName: string): string {
        return this.format(`${pluginName} has loaded successfuly.`);
    }

    public onDestroy(pluginName: string): string {
        return SYMBOLS.destroy + `${pluginName} has been destroyed.`;
    }
}*/