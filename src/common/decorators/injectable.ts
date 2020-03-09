import { Target, Token, TransformerFunction, DependencyWrapper, NonUndefinedField } from "../types";
import { Scope } from "../enums";
import { getBinding } from "../util/getBinding";
import { InjectablesManager } from "../../core/container/injectables-manager";

interface InjectableOptions {
    /** The scope defines how the injectable will be handled for each injection. */
    readonly scope: Scope;

    /** The token is the key used to retrieve the injectable for injection. */
    readonly token?: Token;

    /** An injectable may require async initialization. A transformer function can be provided to do so. */
    readonly registerAsync?: TransformerFunction<any, any>;

    /** The arguments to be injected into the `registerAsync` transformer function. */
    readonly inject?: DependencyWrapper[];
};

const defaultOptions: InjectableOptions = {
    scope: Scope.SINGLETON,
};

export const Injectable = (options = defaultOptions) => (target: Target) => {
    const { scope, token, registerAsync, inject } = options as NonUndefinedField<InjectableOptions>;

    const binding = getBinding(target);
    binding.setInjectable(scope, token || target);
    binding.setRegisterAsync(registerAsync, inject);

    InjectablesManager.register(token || target, target);
}