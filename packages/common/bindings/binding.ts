import { DiscordEvents, Scope } from "../enums";
import { MethodMetadata, ParamMetadata } from "./metadata";
import { Constructable } from "../types";

export class Binding {
  /** Method name to method metadata map. */
  private readonly _methods: Record<string, MethodMetadata> = {};
  
  constructor(
    /** The class this metadata belongs to. */
    private readonly _target: Constructable<any>,
    
    /** The scope of the injectable. */
    private _scope = Scope.SINGLETON,
  ) {}

  get methods(): Record<string, MethodMetadata> {
    return this._methods;
  }

  get target(): Constructable<any> {
    return this._target;
  }

  get scope(): Scope {
    return this._scope;
  }

  get dependencies(): ParamMetadata[] {
    if (this._methods["undefined"])
      return this._methods["undefined"].params;
    return [];
  }

  private getMethod(name: string): MethodMetadata {
    if (!this._methods[name])
      this._methods[name] = new MethodMetadata(name);
    return this._methods[name];
  }

  public setMethodParam(name: string, index: number, token: Constructable<any>, key?: string): void {
    const { params } = this.getMethod(name);
    while (params.length <= index)
      params.push({} as ParamMetadata);
    params[index] = new ParamMetadata(token, key);
  }

  public setMethodEvent(name: string, event: DiscordEvents): void {
    this.getMethod(name).setEvent(event);
  }

  public setScope(scope: Scope) {
    this._scope = scope;
  }
}