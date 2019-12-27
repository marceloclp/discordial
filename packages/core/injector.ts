import { ParamMetadata } from "../common";
import { getBinding } from "../common/utils";
import { Scope } from "../common/enums";
import { Logger } from "./logger";
import { EventDecomposer } from "./event-decomposer";

export class Injector {
  private readonly _instances = new Map<Constructable, Instance>();

  /**
   * Resolves the dependencies of an instance.
   */
  public resolve(
    dps: ParamMetadata[],
    wrapper?: SyntheticWrapper,
    log?: boolean,
    level = 1,
  ): Instance[] {
    const resolvedDps = [];
    for (const dp of dps)
      resolvedDps.push(this.resolveDp(dp, wrapper, log, level));
    return resolvedDps;
  }

  /**
   * Resolves a single dependency.
   */
  private resolveDp(
    dp: ParamMetadata,
    wrapper?: SyntheticWrapper,
    log?: boolean,
    level = 1,
  ): Instance {
    const binding = getBinding(dp.token);
    const { target, scope } = binding;

    if (log)
      Logger.loadingInjectable(target.name, scope, level);

    if (scope === Scope.SINGLETON && this._instances.has(target))
      return this._instances.get(target) as Instance;

    if (scope === Scope.SYNTHETIC && wrapper) {
      const token = EventDecomposer.parseToken(target);
      if (!wrapper[token])
        throw new Error(`${target.name}:${dp.key} is not available on this event.`);
      return wrapper[token];
    }

    const resolvedDps = this.resolve(binding.dependencies, wrapper, log, level + 1);
    const instance = new target(...resolvedDps);
    
    if (scope === Scope.SINGLETON)
      this._instances.set(target, instance);

    return instance;
  }
}