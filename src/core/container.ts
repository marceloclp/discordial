import { InjectableBinding } from "../common/bindings/injectable.binding";
import { MethodsBinding } from "../common/bindings/methods.binding";
import { MethodMetadata } from "../common/metadata/method.metadata";

interface ValueTypes {
    readonly useExisting?: any;

    /** A class that has been decorated with the injectable decorator. */
    readonly useClass?: Constructable;
}

export class Container {
    /** Maps a token to its constructable if one exists. */
    private readonly _constructables = new Map<Token, Constructable>();

    /** Maps a token to its resolved value. */
    private readonly _resolved = new Map<Token, any>();

    private cache(token: Token, value: ValueTypes) {
        if (this._constructables.has(token) || this._constructables.has(token))
            throw new Error('Injectable token is already in use.');
        
        if (value.useClass || value.useExisting)
            throw new Error('Missing value.');

        if (value.useClass) {
            // Check if class is an injectable.
            if (!InjectableBinding.get(value)) throw new Error('Invalid `useClass`: is not an injectable.');
            this._constructables.set(token, value.useClass);
        } else if (value.useExisting) {
            this._resolved.set(token, value.useExisting);
        }
    }

    private async resolve(token: Token) {
        // Tokens that match non constructables are always resolved.
        if (this._resolved.has(token)) return this._resolved.get(token);
        
        // Because non constructables are already resolved,
        // then the token must always match a constructable.
        const constructable = this._constructables.get(token) as Constructable;
        const injectable = InjectableBinding.get(constructable);
        if (!injectable) throw new Error('Invalid injectable.');

        const { ctor } = MethodsBinding.get(constructable);
        const dps = await this.resolveMethod(ctor);

        const instance = new constructable(...dps);

        if (injectable.cacheable)
            this._resolved.set(token, instance);

        return instance;
    }

    private async resolveMethod(method: MethodMetadata): Promise<any[]> {
        const resolved = [];
        for (const param of method.params) {
            const value = await this.resolveParameter(param);
            resolved.push(value);
        }
        return resolved;
    }

    private async resolveParameter(param: ParameterMetadata) {
        const { token, transformerFn, inject } = param;
        const value = await this.resolve(token);

        if (!transformerFn)
            return value;

        const injectResolved = [];
        for (const token of inject)
            injectResolved.push(await this.resolve(token));
        return transformerFn(value, ...injectResolved);
    }
}