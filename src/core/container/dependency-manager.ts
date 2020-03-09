import { InjectablesManager } from "./injectables-manager";
import { Token, TransformerFunction, DependencyWrapper, Instance, Constructable } from "../../common/types";
import { getBinding } from "../../common/util/getBinding";
import { ParamMetadata } from "../../common/metadata/param-metadata";
import { RegisterAsyncMetadata } from "../../common/metadata/register-async-metadata";
import { BindingType, Keys } from "../../common/enums";

/**
 * The Dependency Manager is responsible for resolving dependencies of
 * constructors, class methods and transformer functions.
 */
export class DependencyManager {
    constructor(
        private readonly _injectables: InjectablesManager,
    ) {}

    private get injectables(): InjectablesManager {
        return this._injectables;
    }

    /**
     * Resolves the dependencies of a constructable and returns an instance.
     * 
     * The dependencies may have to be treated differently depending on the
     * type ofinitialization of the constructable. A constructable may require
     * async initialization through the `registerAsync` function.
     * 
     * A target may require a config object from the plugin.
     * 
     * @param {Constructable} target - The constructable class.
     * @param {Constructable} plugin - The plugin class to act as a token.
     * 
     * @returns An instance of the constructable.
     */
    public async resolveTarget(target: Constructable<any>, plugin?: Constructable<any>): Promise<Instance<any>> {
        const ctorMetadata = getBinding(target).ctor;

        if (ctorMetadata instanceof RegisterAsyncMetadata) {
            const params = ctorMetadata.inject.map(dp => {
                if (typeof dp === "string" && dp === Keys.INJECT_CONFIG)
                    return plugin;
                return dp;
            });
            const resolvedDps = await this.resolveTransformerDps(params);
            return ctorMetadata.transformerFn(target, ...resolvedDps);

        } else {
            const params = ctorMetadata.params.map(dp => {
                if (dp.dpToken === Keys.INJECT_CONFIG)
                    return { ...dp, dpToken: plugin } as ParamMetadata;
                return dp;
            });
            const resolvedDps = await this.resolveMethodDps(params);
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
    public async resolveToken(token: Token): Promise<Instance<any>> {
        const target = this.injectables.get(token);

        if (!target) {
            throw new Error([
                `Injectable is not registered.`,
                `You likely forgot to decorate ${token}.`,
            ].join(' '));
        }
        
        const instance = await this.resolveTarget(target);
        
        if (getBinding(target).injectable.isCacheable)
            this.injectables.setInstance(token, instance);

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
    public async resolveTransformerDps(dps: DependencyWrapper[]): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
            if (typeof dp === "object" && dp.token)
                resolved.push(await this.resolveTokenDp(dp.token));
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
    public async resolveMethodDps(dps: ParamMetadata[]): Promise<any[]> {
        const resolved = [];
        for (const dp of dps) {
            const { dpToken, transformerFn, inject } = dp;
            resolved.push(await this.resolveTokenDp(dpToken, transformerFn, inject));
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
        inject: DependencyWrapper[] = []
    ): Promise<any> {
        if (this.injectables.hasInstance(token))
            return this.injectables.getInstance(token);

        const instance = await this.resolveToken(token);

        if (!transformerFn)
            return instance;

        const transformerDps = await this.resolveTransformerDps(inject);
        return transformerFn(instance, ...transformerDps);
    }
}