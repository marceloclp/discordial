import { getBinding } from "../utils";
import { SyntheticMessage, SyntheticChannel, SyntheticObjectKey, SyntheticGuild } from "../synthetic-objects";
import { Constructable } from "../types";

const InjectSyntheticObject = (token: Constructable<any>, key?: string) => (target: any, method: string, index: number) => {
  if (method === undefined) {
    throw new Error("Cannot inject a synthetic object into a plugin constructor. Synthetic objects can only be injected into plugin methods.");
  }
  getBinding(target, true).setMethodParam(method, index, token, key);
}

/**
 * Injects a SyntheticMessage instance.
 */
export const Message = () => InjectSyntheticObject(SyntheticMessage);

/**
 * Injects a Channel instance.
 */
export const Channel = (key?: SyntheticObjectKey) => InjectSyntheticObject(SyntheticChannel, key);

/**
 * Injects a Channel instance.
 */
export const Guild = (key?: SyntheticObjectKey) => InjectSyntheticObject(SyntheticGuild, key);