import { CreateParamDecorator } from "./create-param.decorator";

export const Inject = (token: Token) => CreateParamDecorator(token);