class ParameterMetadata {
    constructor(
        private readonly _token: Token,

        private readonly _transformerFn?: TransformerFn,

        private readonly _inject?: Token[],
    ) {}

    public get token(): Token {
        return this._token;
    }

    public get transformerFn(): TransformerFn | undefined {
        return this._transformerFn;
    }

    public get inject(): Token[] {
        return this._inject || [];
    }
}