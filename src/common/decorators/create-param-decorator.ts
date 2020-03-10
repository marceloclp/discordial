import { getBinding } from "../util/getBinding";

interface InjectOptions {
    /** The dependency token that will be injected into the method. */
    readonly dpToken: Token;

    /** The parameter may require a transformation before injection. */
    readonly transformerFn?: TransformerFunction;

    /** The transformer function dependecies arguments. */
    readonly inject?: DependencyWrapper[];
};

export function CreateParamDecorator(options: InjectOptions) {
    return function(target: any, methodName: string, index: number) {
        const {
            dpToken,
            transformerFn,
            inject
        } = options as NonNullableFields<InjectOptions>;

        getBinding(target)
            .getMethod(methodName)
            .setParam(index, dpToken, transformerFn, inject);
    };
};