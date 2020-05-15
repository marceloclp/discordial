export class MethodMetadata {
    constructor(
        private readonly _name: string,
    ) {}

    private readonly _params: ParameterMetadata[] = [];

    private readonly _event?: string;

    public get name(): string {
        return this._name;
    }

    public get params(): ParameterMetadata[] {
        return this._params;
    }

    public get event(): string | undefined {
        return this._event;
    }

    public setEvent(event: string): void {
        (this._event as any) = event;
    }

    public setParam(index: number, ...args: Ctor<typeof ParameterMetadata>): void {
        while (this._params.length <= index)
            this._params.push(null as any);
        this._params[index] = new ParameterMetadata(...args);
    }
}