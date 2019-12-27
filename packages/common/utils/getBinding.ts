import { MetadataKeys } from "../enums";
import { Binding } from "../bindings";

/**
 * Returns the Binding from a target metadata and initializes a new instance if
 * one does not yet exist.
 * 
 * @param target The class to attach the metadata.
 * @param init If true, will initialize a new Binding class if one doesn't exist.
 */
export const getBinding = (target: any, init?: boolean): Binding => {
  if (!Reflect.getMetadata(MetadataKeys.BINDING, target)) {
    if (init) Reflect.defineMetadata(MetadataKeys.BINDING, new Binding(target), target);
  }
  return Reflect.getMetadata(MetadataKeys.BINDING, target);
}