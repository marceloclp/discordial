import { getBinding } from "../utils"
import { Scope } from "../enums";

interface InjectableOptions {
  scope: Scope,
};

const defaultOptions: InjectableOptions = {
  scope: Scope.SINGLETON
};

export const Injectable = (options = defaultOptions) => (target: any) => {
  const binding = getBinding(target, true);
  binding.setScope(options.scope);
};