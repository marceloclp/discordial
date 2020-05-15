import { getBinding } from "../utils/getBinding";

export class InjectableBinding {
    constructor(
        private readonly _scope: Scopes,

        private readonly _token: Token,
    ) {}

    public get scope(): Scopes {
        return this._scope;
    }

    public get token(): Token {
        return this._token;
    }

    public get cacheable(): boolean {
        return this._scope === Scopes.SINGLETON;
    }

    static get(target: any, ...args: OptionalCtor<typeof InjectableBinding>): InjectableBinding {
        return getBinding(InjectableBinding, Bindings.INJECTABLE, target, args);
    }
}