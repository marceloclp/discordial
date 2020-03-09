import { Target } from "../types";
import { ParamMetadata, ParamMetadataCtor } from "./param-metadata";
import { DiscordEvents } from "../enums";

export class MethodMetadata {
    constructor(
        /** The constructable who owns this method. */
        private readonly _target: Target,

        /** The method name is required to be able to reference the method. */
        private readonly _name: string,
    ) {}

    /** The params store the metadata about what dependencies to inject. */
    private readonly _params: (ParamMetadata | null)[] = [];

    private _event?: DiscordEvents;

    public get target(): Target {
        return this._target;
    }

    public get name(): string {
        return this._name;
    }
    
    public get params(): ParamMetadata[] {
        return this._params as ParamMetadata[];
    }

    public get event(): DiscordEvents | undefined {
        return this._event;
    }

    public setEvent(event: DiscordEvents): void {
        this._event = event;
    }

    public setParam(index: number, ...args: ParamMetadataCtor): ParamMetadata {
        const param = new ParamMetadata(...args);
        while (index >= this._params.length)
            this._params.push(null);
        this._params[index] = param;
        return param;
    }
}