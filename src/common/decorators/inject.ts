import { Token, TransformerFunction, DependencyWrapper, NonUndefinedField, Target } from "../types";
import { getBinding } from "../util/getBinding";

interface InjectOptions {
    /** The dependency token that will be injected into the method. */
    readonly dpToken: Token;

    /** The parameter may require a transformation before injection. */
    readonly transformerFn?: TransformerFunction<any, any>;

    /** The transformer function dependecies arguments. */
    readonly inject?: DependencyWrapper[];
};

export const Inject = (options: InjectOptions | Token) => (target: Target, methodName: string, index: number) => {
    const { dpToken, transformerFn, inject } = options as NonUndefinedField<InjectOptions>;

    getBinding(target)
        .getMethod(methodName)
        .setParam(
            index,
            dpToken || options as Token,
            transformerFn as TransformerFunction<any, any>,
            inject,
        );
}