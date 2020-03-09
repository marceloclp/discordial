import { Constructable } from "../types";

export type PluginMetadataCtor = ConstructorParameters<typeof PluginMetadata>;

export class PluginMetadata {
    constructor(
        private readonly _controllers: Constructable<any>[],
    ) {}

    public get controllers(): Constructable<any>[] {
        return this._controllers;
    }
}