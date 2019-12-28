import Discord from "discord.js";
import { SyntheticObjectKey } from "../common/synthetic-objects/synthetic-object";
import { SyntheticMessage, SyntheticChannel, SyntheticGuild } from "../common/synthetic-objects";
import { SyntheticWrapper, Constructable } from "../common/types";

const def = SyntheticObjectKey.DEFAULT;

const mapEntityToDecomposer: Record<string, Function> = {
  [Discord.Message.name]: (_: Discord.Message) => ({
    [`${SyntheticChannel.name}:${def}`]: new SyntheticChannel(_.channel),
    [`${SyntheticGuild.name}:${def}`]: new SyntheticGuild(_.guild),
  })
};

export class EventDecomposer {
  private readonly _mapEntityToSynthetic: Record<string, Constructable<any>> = {
    [Discord.Message.name]: SyntheticMessage
  };

  /**
   * Creates a unique token used to map synthetic object that have more than one instance.
   * 
   * @param ctor The synthetic object constructor.
   * @param key The key that indicates which object to return.
   */
  public static parseToken(ctor: Constructable<any>, key = SyntheticObjectKey.DEFAULT) {
    return `${ctor.name}:${key}`;
  }

  /**
   * Decomposes the arguments of an event into a synthetic object wrapper.
   * 
   * Each synthetic object has a token of shape `ctorName:key`, which is used
   * for handling events that possess more than one type of the same entity.
   * 
   * @param args The arguments of a Discord event.
   */
  public decompose(...args: any[]): SyntheticWrapper {
    const lowPriorityWrapper: SyntheticWrapper = {};
    const highPriorityWrapper = args.reduce((wrapper: SyntheticWrapper, param) => {
      if (!param.constructor || !param.constructor.name)
        return wrapper;

      if (mapEntityToDecomposer[param.constructor.name])
        Object.assign(lowPriorityWrapper, mapEntityToDecomposer[param.constructor.name](param));

      const name: string = param.constructor.name;
      const ctor = this._mapEntityToSynthetic[name];
      if (ctor) wrapper[EventDecomposer.parseToken(ctor)] = new ctor(param);

      return wrapper;
    }, {});
    return { ...highPriorityWrapper, ...lowPriorityWrapper };
  }
}