import { getBinding } from "../util/getBinding";

interface ControllerOptions {}

export function Controller(opts?: ControllerOptions) {
    return function(target: Constructable) {
        getBinding(target)
            .setController();
    };
};