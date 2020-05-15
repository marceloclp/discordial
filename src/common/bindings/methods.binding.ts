import { MethodMetadata } from "../metadata/method.metadata";
import { getBinding } from "../utils/getBinding";

export class MethodsBinding {
    private readonly _methods: Record<string, MethodMetadata> = {};

    public get ctor(): MethodMetadata {
        return this._methods["undefined"];
    }

    public get(method: string): MethodMetadata {
        if (!this._methods[method])
            this._methods[method] = new MethodMetadata(method);
        return this._methods[method];
    }

    static get(target: any): MethodsBinding {
        return getBinding(MethodsBinding, Bindings.METHODS, target, []);
    }
}