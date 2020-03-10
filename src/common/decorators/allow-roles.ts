import { getBinding } from "../util/getBinding"

/**
 * Allows an endpoint to be reached if the user has at least one of the allowed
 * roles. Only available for `message` events.
 * 
 * @param {string[]} roles - The roles allowed.
 */
export function AllowRoles(roles: string[]) {
    return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
        getBinding(target)
            .getMethod(methodName)
            .setAllowRoles(roles);
    };
};