import { TransformerFunction, Token, DependencyWrapper } from "../types";

export type ParamMetadataCtor = ConstructorParameters<typeof ParamMetadata>;

export class ParamMetadata {
    constructor(
        /** The dependency token that will be injected into the method. */
        private readonly _dpToken: Token,

        /** The parameter may require a transformation before injection. */
        private readonly _transformerFn?: TransformerFunction<any, any>,

        /** The transformer function dependecies arguments. */
        private readonly _inject: DependencyWrapper[] = [],
    ) {}

    public get dpToken(): Token {
        return this._dpToken;
    }

    public get transformerFn(): TransformerFunction<any, any> | undefined {
        return this._transformerFn;
    }

    public get inject(): DependencyWrapper[] {
        return this._inject;
    }
}