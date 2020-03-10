import { DependenciesManager } from "../../core/container/dependencies-manager";
import { getBinding } from "../util/getBinding";
import { Scope } from "../enums";

interface InjectableOptions {
    /** The scope defines how the injectable will be handled for each injection. */
    readonly scope: Scope;

    /** The token is the key used to retrieve the injectable for injection. */
    readonly token?: Token;

    /** An injectable may require async initialization. A transformer function can be provided to do so. */
    readonly registerAsync?: TransformerFunction;

    /** The arguments to be injected into the `registerAsync` transformer function. */
    readonly inject?: DependencyWrapper[];
};

const defaultOptions: InjectableOptions = {
    scope: Scope.SINGLETON,
};

export function Injectable(opts = defaultOptions) {
    return function(target: Constructable) {
        const {
            scope,
            token,
            registerAsync,
            inject,
        } = opts as NonNullableFields<InjectableOptions>;

        const binding = getBinding(target);
        binding.setInjectable(scope, token || target);
        binding.setRegisterAsync(registerAsync, inject);

        if (token)
            DependenciesManager.register(token, target);
        DependenciesManager.register(target, target);
    };
};