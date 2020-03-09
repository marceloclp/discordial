import { Scope } from "../enums";
import { Token } from "../types";

export type InjectableMetadataCtor = ConstructorParameters<typeof InjectableMetadata>;

export class InjectableMetadata {
    constructor(
        /** The scope of the injectable determines how it is instantiated. */
        private readonly _scope: Scope,

        /** An alternative key can be used to register the injectable to avoid duplicates between packages. */
        private readonly _token: Token,
    ) {}
    
    public get scope(): Scope {
        return this._scope;
    }

    public get token(): Token {
        return this._token;
    }

    public get isCacheable(): boolean {
        return this._scope === Scope.SINGLETON;
    }
}