import { Constructable } from "../types";
import { getBinding } from "../util/getBinding";

interface ControllerOptions {}

export const Controller = (opts?: ControllerOptions) => (target: Constructable<any>) => {
    getBinding(target)
        .setController();
}