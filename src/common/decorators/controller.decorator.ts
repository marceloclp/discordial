import { ControllerBinding } from "../bindings/controller.binding"
import { MethodsBinding } from "../bindings/methods.binding";

export const Controller = () => (target: any) => {
    ControllerBinding.get(target);

    // Makes sure that the methods binding is initialized.
    MethodsBinding.get(target);
}