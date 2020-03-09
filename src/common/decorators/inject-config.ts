import { CreateParamDecorator } from "./create-param-decorator";
import { Keys } from "../enums";

/**
 * Injects the config of the plugin into its controllers.
 */
export const InjectConfig = () => CreateParamDecorator({
    dpToken: Keys.INJECT_CONFIG,
});