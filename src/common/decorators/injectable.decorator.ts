import { InjectableBinding } from "../bindings/injectable.binding";
import { MethodsBinding } from "../bindings/methods.binding";

interface InjectableOptions {
    readonly scope: Scopes;

    readonly token?: Token;
};

const defaultOptions: InjectableOptions = {
    scope: Scopes.SINGLETON,
};

export const Injectable = (options = defaultOptions) => (target: any) => {
    const { scope, token } = options as Require<InjectableOptions>;
    InjectableBinding.get(target, scope, token);

    // Makes sure that the methods binding is initialized.
    MethodsBinding.get(target);
}