import { CreateParamDecorator } from "./create-param-decorator";
import { Keys } from "../enums";

/**
 * Injects the config of the plugin into its controllers.
 */
export function InjectConfig() {
    return CreateParamDecorator({
        dpToken: Keys.INJECT_CONFIG,
    });
};