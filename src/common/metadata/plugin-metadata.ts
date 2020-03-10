export type PluginMetadataCtor = ConstructorParameters<typeof PluginMetadata>;

export class PluginMetadata {
    constructor(
        private readonly _controllers: Constructable[],
    ) {}

    public get controllers(): Constructable[] {
        return this._controllers;
    }
}