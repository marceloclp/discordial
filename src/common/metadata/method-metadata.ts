import { Target } from "../types";
import { ParamMetadata, ParamMetadataCtor } from "./param-metadata";
import { DiscordEvents } from "../enums";
import { MethodMetadataRoles } from "../interfaces/method-metadata-roles";

export class MethodMetadata {
    constructor(
        /** The constructable who owns this method. */
        private readonly _target: Target,

        /** The method name is required to be able to reference the method. */
        private readonly _name: string,
    ) {}

    /** The params store the metadata about what dependencies to inject. */
    private readonly _params: (ParamMetadata | null)[] = [];

    private readonly _roles: MethodMetadataRoles = {};

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

    public get roles(): MethodMetadataRoles {
        return this._roles;
    }

    public setAllowRoles(roles: string[]): void {
        this._roles.allow = new Set(roles);
    }

    public setBlockRoles(roles: string[]): void {
        this._roles.block = new Set(roles);
    }

    public setOnlyAllowAllRoles(roles: string[]): void {
        this._roles.onlyAllowAll = new Set(roles);
    }

    public setOnlyBlockAllRoles(roles: string[]): void {
        this._roles.onlyBlockAll = new Set(roles);
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