import { Target } from "../types";
import { Binding } from "../metadata/binding";

const BindingKey = "discordial:binding";

/**
 * Retrieves the metadata binding of a Constructable or Instance, and
 * initializes the Binding if undefined.
 * 
 * @param {Target} target - The constructable.
 * 
 * @returns The class' Binding.
 */
export const getBinding = (target: Target): Binding => {
    if (!Reflect.hasMetadata(BindingKey, target)) {
        const binding = new Binding(target);
        Reflect.defineMetadata(BindingKey, binding, target);
    }
    return Reflect.getMetadata(BindingKey, target);
}