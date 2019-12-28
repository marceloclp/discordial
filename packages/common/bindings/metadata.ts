import { DiscordEvents } from "../enums";
import { Constructable } from "../types";

/**
 * Describes an injectable parameter.
 */
export class ParamMetadata {
  constructor(
    /** The class to be injected into this parameter. */
    private readonly _token: Constructable<any>,

    /** An optional key, used for improved dependency injection. */
    private readonly _key?: string,
  ) {}

  get token(): Constructable<any> {
    return this._token;
  }

  get key(): string {
    return this._key as string;
  }
}

/**
 * Describes a method signature.
 */
export class MethodMetadata {
  /** The parameters metadata array. */
  private readonly _params: ParamMetadata[] = [];
  
  /** A method may be attached to a discord event. */
  private _event?: DiscordEvents;

  constructor(
    /** Method name. */
    private readonly _name: string,
  ) {}

  get params(): ParamMetadata[] {
    return this._params;
  }

  get event(): DiscordEvents | undefined {
    return this._event;
  }

  get name(): string {
    return this._name;
  }

  public setEvent(event: DiscordEvents): void {
    this._event = event;
  }
}