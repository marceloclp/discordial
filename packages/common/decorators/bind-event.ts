import { DiscordEvents } from "../enums";
import { getBinding } from "../utils";

/**
 * Binds a method to a Discord event. Every time the event occurs, the bound
 * method will be executed once.
*/
export const BindEvent = (event: DiscordEvents) => (target: any, method: string, descriptor: PropertyDescriptor) => {
  getBinding(target, true).setMethodEvent(method, event);
}