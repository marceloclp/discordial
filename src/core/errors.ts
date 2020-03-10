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

export class InvalidControllerError extends Error {
    constructor(controllerName: string) {
        super([
            `${controllerName} is not a Controller.`,
            `You likely used the wrong decorator on the class.`,
        ].join(' '));
        this.name = "InvalidControllerError";
    }
}

export class DuplicateControllerError extends Error {
    constructor(controllerName: string) {
        super([
            `${controllerName} already has been instantiated.`,
            `You are probably importing the controller more than one time.`,
        ].join(' '));
        this.name = "DuplicateControllerError";
    }
}

export class DuplicateInjectableError extends Error {
    constructor(injectableName: string) {
        super([
            `${injectableName} has already been registered.`,
            `There are multiple injectables with the same signature.`,
        ].join(' '));
        this.name = "DuplicateInjectableError";
    }
}

export class DuplicateInjectableInstanceError extends Error {
    constructor(injectableName: string) {
        super([
            `${injectableName} instance is being registered twice.`,
            `This is an internal error, please report on GitHub.`,
        ].join(' '));
        this.name = "DuplicateInjectableInstanceError";
    }
}

export class UnregisteredInjectableError extends Error {
    constructor(token: any) {
        super([
            `Impossible to resolve ${token} because it's not registered.`,
            `If this is an injectable, then you forgot to decorate the class.`,
        ].join(' '));
        this.name = "UnregisteredInjectableError";
    }
}

export class MissingPluginConfigError extends Error {
    constructor(pluginName: string) {
        super([
            `The config object attached to ${pluginName} was injected,`,
            `but no object was found. Make sure your plugin is being`,
            `registered as a dynamic plugin.`,
        ].join(' '));
    }
}