import { DialBinding } from "../bindings/dial.binding"

export const Dial = () => (target: any) => {
    DialBinding.get(target);
}