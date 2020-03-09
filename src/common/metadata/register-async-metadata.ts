import { TransformerFunction, DependencyWrapper } from "../types";

export type RegisterAsyncMetadataCtor = ConstructorParameters<typeof RegisterAsyncMetadata>;

export class RegisterAsyncMetadata {
    constructor(
        /** The transformer function used to instantiate the class. */
        private readonly _transformerFn: TransformerFunction<any, any>,

        /** The arguments to be injected into the transformer function. */
        private readonly _inject: DependencyWrapper[] = [],
    ) {}

    public get transformerFn(): TransformerFunction<any, any> {
        return this._transformerFn;
    }

    public get inject(): DependencyWrapper[] {
        return this._inject;
    }
}