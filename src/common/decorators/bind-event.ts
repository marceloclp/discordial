import { DiscordEvents } from "../enums";
import { getBinding } from "../util/getBinding";

export function BindEvent(event: DiscordEvents) {
    return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
        getBinding(target)
            .getMethod(methodName)
            .setEvent(event);
    };
};