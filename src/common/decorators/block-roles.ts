import { getBinding } from "../util/getBinding"

export function BlockRoles(roles: string[]) {
    return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
        getBinding(target)
            .getMethod(methodName)
            .setBlockRoles(roles);
    }
}