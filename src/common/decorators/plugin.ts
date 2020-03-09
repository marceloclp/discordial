import { Target, Constructable } from "../types";
import { getBinding } from "../util/getBinding";

interface PluginOptions {
    readonly controllers: Constructable<any>[];
};

export const Plugin = (opts: PluginOptions) => (target: Target) => {
    const { controllers } = opts;
    
    getBinding(target)
        .setPlugin(controllers)
}