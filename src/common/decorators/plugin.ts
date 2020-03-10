import { getBinding } from "../util/getBinding";

interface PluginOptions {
    readonly controllers: Constructable[];
};

export function Plugin(opts: PluginOptions) {
    return function(target: Constructable) {
        const { controllers } = opts;

        getBinding(target)
            .setPlugin(controllers);
    }
}