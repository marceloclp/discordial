import { Token, TransformerFunction, DependencyWrapper, Instance, Constructable } from "../../common/types";
import { getBinding } from "../../common/util/getBinding";
import { ParamMetadata } from "../../common/metadata/param-metadata";
import { RegisterAsyncMetadata } from "../../common/metadata/register-async-metadata";
import { Keys } from "../../common/enums";
import { LoggerInterface } from "../logger/logger";

type InjectablesMap = Map<Token, Constructable<any>>;

type InstancesMap = Map<Token, any>;

/**
 * The Dependency Manager is responsible for resolving dependencies of
 * constructors, class methods and transformer functions.
 */
export class DependenciesManager {
    static readonly injectables: InjectablesMap = new Map();
    private readonly instances: InstancesMap = new Map();

    constructor(
        private readonly _logger: LoggerInterface,
    ) {}

    public static register(token: Token, target: any): void {
        if (DependenciesManager.injectables.has(token)) {
            throw new Error(`The injectable <${typeof target}> can only be registered once.`);
        }
        DependenciesManager.injectables.set(token, target);
    }

    public getInjectable(token: Token): any {
        return DependenciesManager.injectables.get(token);
    }

    public setInstance(token: Token, instance: any): void {
        if (this.instances.has(token)) {
            throw new Error("Injectable instance is being registered twice.");
        }
        this.instances.set(token, instance);
    }

    public getInstance(token: Token): void {
        return this.instances.get(token);
    }

    private hasInstance(token: Token): boolean {
        return this.instances.has(token);
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
    public async resolveTarget(
        target: Constructable<any>,
        plugin?: Constructable<any>
    ): Promise<Instance<any>> {
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
     * @param {Token} token - The injectable token.
     * 
     * @returns An instance of the injectable.
     */
    public async resolveToken(token: Token, plugin?: Constructable<any>): Promise<Instance<any>> {
        const target = this.getInjectable(token);

        if (!target) {
            throw new Error([
                `Injectable is not registered.`,
                `You likely forgot to decorate ${token}.`,
            ].join(' '));
        }
        
        const instance = await this.resolveTarget(target, plugin);
        
        if (getBinding(target).injectable.isCacheable)
            this.setInstance(token, instance);

        return instance;
    }

    /**
     * The transformer function can take any type of argument (tokens, functions,
     * classes for static usage, etc), so they have to be treated separately.
     * 
     * @param {DependencyWrapper} dps - The dependencies to be resolved.
     * 
     * @returns The resolved dependencies.
     */
    public async resolveTransformerDps(dps: DependencyWrapper[], plugin?: Constructable<any>): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
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
     * @param {ParamMetadata} dps - The dependencies to be resolved.
     * 
     * @returns The resolved dependencies.
     */
    public async resolveMethodDps(dps: ParamMetadata[], plugin?: Constructable<any>): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
            const { dpToken, transformerFn, inject } = dp;
            resolved.push(await this.resolveTokenDp(dpToken, transformerFn, inject, plugin));
        }
        return resolved;
    }

    /**
     * Resolves a single dependency and applies any transformer functions required
     * for the injection.
     * 
     * @param token 
     * @param transformerFn 
     * @param inject 
     * 
     * @returns A resolved token dependency ready to be injected.
     */
    private async resolveTokenDp(
        token: Token,
        transformerFn?: TransformerFunction<any, any>,
        inject: DependencyWrapper[] = [],
        plugin?: Constructable<any>,
    ): Promise<any> {
        if (this.hasInstance(token))
            return this.getInstance(token);

        if (this.isConfigDp(token))
            return this.resolveConfigDp(plugin as Constructable<any>);

        const instance = await this.resolveToken(token, plugin);

        if (!transformerFn)
            return instance;

        const transformerDps = await this.resolveTransformerDps(inject, plugin);
        return transformerFn(instance, ...transformerDps);
    }

    private isConfigDp(token: Token): boolean {
        return typeof token === "string" && token === Keys.INJECT_CONFIG;
    }

    private resolveConfigDp(plugin: Constructable<any>): any {
        if (!this.hasInstance(plugin)) {
            throw new Error([
                `The config from the plugin ${plugin.name} was requested,`,
                `but there is no config attached to this plugin. Make sure`,
                `your plugin wrapper has the config object.`,
            ].join(' '));
        }
        return this.getInstance(plugin);
    }
}