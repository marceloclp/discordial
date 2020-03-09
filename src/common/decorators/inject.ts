import { CreateParamDecorator } from "./create-param-decorator";
import { Token } from "../types";

/**
 * Injects dependencies into constructors and methods.
 * 
 * @param {Token} token - A token used to retrieve the dependency.
 */
export const Inject = (token: Token) => CreateParamDecorator({
    dpToken: token,
});