import { CreateParamDecorator } from "./create-param-decorator";

/**
 * Injects dependencies into constructors and methods.
 * 
 * @param {Token} token - A token used to retrieve the dependency.
 */
export function Inject(token: Token) {
    return CreateParamDecorator({
        dpToken: token,
    });
};