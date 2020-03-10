import { LoggerInterface } from "../logger/logger";
import { RegisterAsyncMetadata } from "../../common/metadata/register-async-metadata";
import { ParamMetadata } from "../../common/metadata/param-metadata";
import { getBinding } from "../../common/util/getBinding";
import { Keys } from "../../common/enums";
import { UnregisteredInjectableError, DuplicateInjectableInstanceError, DuplicateInjectableError, MissingPluginConfigError } from "../errors";

/**
 * The Dependency Manager is responsible for resolving dependencies of
 * constructors, class methods and transformer functions.
 */
export class DependenciesManager {
    static readonly _injectablesMap = new Map<Token, Constructable>();
    private readonly _instancesMap  = new Map<Token, any>();

    constructor(
        private readonly _logger: LoggerInterface,
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public static register(token: Token, target: Constructable): void {
        if (DependenciesManager._injectablesMap.has(token))
            throw new DuplicateInjectableError(target.name);
        DependenciesManager._injectablesMap.set(token, target);
    }

    public getInjectable(token: Token): any {
        return DependenciesManager._injectablesMap.get(token);
    }

    public setInstance(token: Token, instance: any): void {
        if (this._instancesMap.has(token))
            throw new DuplicateInjectableInstanceError(instance.constructor.name);
        this._instancesMap.set(token, instance);
    }

    public getInstance(token: Token): void {
        return this._instancesMap.get(token);
    }

    private hasInstance(token: Token): boolean {
        return this._instancesMap.has(token);
    }

    /**
     * Resolves the dependencies of a constructable and returns an instance.
     * 
     * The dependencies may have to be treated differently depending on the
     * type ofinitialization of the constructable. A constructable may require
     * async initialization through the `registerAsync` function.
     * 
     * A constructable may also insert the plugin's config object.
     * 
     * @param {Constructable} target - The constructable class.
     * @param {Constructable} plugin - The plugin who owns the config object.
     * 
     * @returns An instance of the constructable.
     */
    public async resolveTarget(target: Constructable, plugin?: Constructable): Promise<any> {
        const ctorMetadata = getBinding(target).ctor;

        if (ctorMetadata instanceof RegisterAsyncMetadata) {
            const params = ctorMetadata.inject;
            const resolvedDps = await this.resolveTransformerDps(params, plugin);
            return ctorMetadata.transformerFn(target, ...resolvedDps);

        } else {
            const params = ctorMetadata.params;
            const resolvedDps = await this.resolveMethodDps(params, plugin);
            return new target(...resolvedDps);
        }
    }
    
    /**
     * Resolves the dependencies of an injectable and returns an instance. It
     * will cache the instance if the injectable is cacheable.
     * 
     * An injectable may require the config object returned by the plugin who
     * owns the controller who is requiring the injectable.
     * 
     * @param {Token}         token  - The injectable token.
     * @param {Constructable} plugin - The plugin who owns the config object.
     * 
     * @returns An instance of the injectable.
     */
    public async resolveToken(token: Token, plugin?: Constructable): Promise<any> {
        const target = this.getInjectable(token);

        if (!target)
            throw new UnregisteredInjectableError(token);
        
        const instance = await this.resolveTarget(target, plugin);
        
        if (getBinding(target).injectable.isCacheable)
            this.setInstance(token, instance);

        return instance;
    }

    /**
     * The transformer function can take any type of argument (tokens, functions,
     * classes for static usage, etc), so they have to be treated separately.
     * 
     * A transformer function may be used to register an injectable async, so it
     * may require a config object from the parent plugin.
     * 
     * @param {DependencyWrapper} dps    - The dependencies to be resolved.
     * @param {Constructable}     plugin - The plugin who owns the config object.
     * 
     * @returns The resolved transformer/inject dependencies.
     */
    public async resolveTransformerDps(dps: DependencyWrapper[], plugin?: Constructable): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
            if (!dp)
                continue;
            if (typeof dp === "object" && dp.token)
                resolved.push(await this.resolveTokenDp(dp.token, undefined, undefined, plugin));
            else if (this.isConfigDp(dp))
                resolved.push(this.resolveConfigDp(dp));
            else resolved.push(dp);
        }
        return resolved;
    }

    /**
     * A class method can only take tokens as injectable parameters. Each token
     * may have a transformer function attached to it.
     * 
     * A constructor method may require the config object.
     * 
     * @param {ParamMetadata} dps    - The dependencies to be resolved.
     * @param {Constructable} plugin - The plugin who owns the config object.
     * 
     * @returns The resolved method dependencies.
     */
    public async resolveMethodDps(dps: ParamMetadata[], plugin?: Constructable): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
            if (!dp)
                continue;
            const { dpToken, transformerFn, inject } = dp;
            resolved.push(await this.resolveTokenDp(dpToken, transformerFn, inject, plugin));
        }
        return resolved;
    }

    /**
     * Resolves a single dependency and applies any transformer functions required
     * for the injection.
     * 
     * @param {Token}             token         - The dependency token to be resolved.
     * @param {Function}          transformerFn - An option function to transform the dp before return.
     * @param {DependencyWrapper} inject        - A list of dps to be injected into the transformer.
     * @param {Constructable}     plugin        - The plugin who owns the config object.
     * 
     * @returns A resolved token dependency ready to be injected.
     */
    private async resolveTokenDp(
        token: Token,
        transformerFn?: TransformerFunction,
        inject: DependencyWrapper[] = [],
        plugin?: Constructable,
    ): Promise<any> {
        if (this.hasInstance(token))
            return this.getInstance(token);

        if (this.isConfigDp(token))
            return this.resolveConfigDp(plugin as Constructable);

        const instance = await this.resolveToken(token, plugin);

        if (!transformerFn)
            return instance;

        const transformerDps = await this.resolveTransformerDps(inject, plugin);
        return transformerFn(instance, ...transformerDps);
    }

    /**
     * Checks if a token is requiring the config object owned by the parent plugin.
     * 
     * @param {Token} token - The token to be evaluated.
     * 
     * @returns A boolean indicating if the token refers to the config object.
     */
    private isConfigDp(token: Token): boolean {
        return typeof token === "string" && token === Keys.INJECT_CONFIG;
    }

    /**
     * Resolves a configuration dependency by retrieving the config associated
     * with the plugin constructable.
     * 
     * @param {Constructable} plugin - The plugin constructable associated with the config.
     * 
     * @returns The config object.
     */
    private resolveConfigDp(plugin: Constructable): any {
        if (!this.hasInstance(plugin))
            throw new MissingPluginConfigError(plugin.name);
        return this.getInstance(plugin);
    }
}