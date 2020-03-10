export class PluginFormatError extends Error {
    constructor() {
        super([
            `Invalid plugin provided in the plugins lists.`,
            `You need to provide a Constructable or a PluginWrapper.`,
        ].join(' '));
        this.name = "InvalidPluginFormatError";
    }
}

export class InvalidPluginError extends Error {
    constructor(pluginName: string) {
        super([
            `${pluginName} is not a plugin.`,
            `You likely imported the wrong class into the plugin list`,
            `or decorated the class with the wrong decorator.`,
        ].join(' '));
        this.name = "InvalidPluginError";
    }
}

export class DuplicatePluginError extends Error {
    constructor(pluginName: string) {
        super([
            `Plugin ${pluginName} has already been initialized.`,
            `The plugin is likely being imported twice.`,
        ].join(' '));
        this.name = "DuplicatePluginError";
    }
}