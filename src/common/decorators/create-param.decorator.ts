import { MethodsBinding } from "../bindings/methods.binding"

export const CreateParamDecorator = (token: Token, fn?: TransformerFn, inject?: Token[]) => {
    return (target: any, method: string, index: number) => {
        MethodsBinding
            .get(target)
            .get(method)
            .setParam(index, token, fn, inject);
    }
}