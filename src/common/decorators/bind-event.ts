import { DiscordEvents } from "../enums";
import { Instance } from "../types";
import { getBinding } from "../util/getBinding";

export const BindEvent = (event: DiscordEvents) => (target: Instance<any>, methodName: string, descriptor: PropertyDescriptor) => {
    getBinding(target)
        .getMethod(methodName)
        .setEvent(event);
}