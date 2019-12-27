import { DiscordEvents } from "../enums";

/**
 * Describes an injectable parameter.
 */
export class ParamMetadata {
  constructor(
    /** The class to be injected into this parameter. */
    private readonly _token: Constructable,

    /** An optional key, used for improved dependency injection. */
    private readonly _key?: string,
  ) {}

  get token(): Constructable {
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

    /** The method this metadata belongs to. */
    private readonly _fn: SpreadFunction
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

  get fn(): SpreadFunction {
    return this._fn;
  }

  public setEvent(event: DiscordEvents): void {
    this._event = event;
  }
}