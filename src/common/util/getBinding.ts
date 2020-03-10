import { Binding } from "../metadata/binding";
import { Keys } from "../enums";

const BindingKey = Keys.BINDING;

/**
 * Retrieves the metadata binding of a Constructable or Instance, and
 * initializes the Binding if undefined.
 * 
 * @param {Constructable} target - The constructable.
 * 
 * @returns The class' Binding.
 */
export const getBinding = (target: Constructable): Binding => {
    if (!Reflect.hasMetadata(BindingKey, target)) {
        const binding = new Binding(target);
        Reflect.defineMetadata(BindingKey, binding, target);
    }
    return Reflect.getMetadata(BindingKey, target);
}