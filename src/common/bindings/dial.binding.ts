import { getBinding } from "../utils/getBinding";

export class DialBinding {
    static get(target: any, ...args: Ctor<typeof DialBinding>): DialBinding {
        return getBinding(DialBinding, Bindings.DIAL, target, args);
    }
}