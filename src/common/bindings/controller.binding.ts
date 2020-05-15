import { getBinding } from "../utils/getBinding";

export class ControllerBinding {
    static get(target: any): ControllerBinding {
        return getBinding(ControllerBinding, Bindings.CONTROLLER, target, []);
    }
}