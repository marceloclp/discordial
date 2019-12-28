import Discord from "discord.js";
import { DiscordEvents } from "../common/enums";
import { getBinding } from "../common/utils";
import { Logger } from "./logger";
import { Injector } from "./injector";
import { MethodMetadata, ParamMetadata } from "../common/bindings";
import { EventDecomposer } from "./event-decomposer";
import { InstanceMap, SpreadFunction } from "../common/types";

interface MethodDescriptor {
  fn: SpreadFunction,
  params: ParamMetadata[],
  name: string,       // Used for logging purposes only.
  pluginName: string, // Used for logging purposes only.
};

type EventsMap = Record<DiscordEvents, MethodDescriptor[]>;

export class EventBinder {
  /** Used to decompose the event params and build synthetic objects. */
  private readonly _eventDecomposer = new EventDecomposer();

  /** Used to properly invoke the plugin methods that are attached to Discord events. */
  private readonly _eventsMap: EventsMap = Object.values(DiscordEvents).reduce(
    (map: Record<any, any>, event) => ({ ...map, [event]: [] } as EventsMap), {}
  );

  /**
   * Pushes the plugin instance methods to the correct event array.
   * 
   * @param instances The instances map.
   */
  private mapMethods(instances: InstanceMap): void {
    for (const [id, instance] of instances) {
      Logger.bindingPlugin(instance.constructor.name);

      const { methods } = getBinding(instance);
      Object.values(methods).forEach(({ name, event, params }) => {
        Logger.bindingMethod(name, event as string);
        if (!event) return;
        const fn: SpreadFunction = instance[name].bind(instance);
        this._eventsMap[event].push({
          params,
          fn,
          name,
          pluginName: instance.constructor.name
        });
      })
    }
  }

  /**
   * Creates a listener callback that invokes the attached methods.
   * 
   * @param event The event name.
   * @param injector The injector is required to properly handle the methods dependencies.
   */
  private createListener(event: DiscordEvents, injector: Injector): Function {
    const methods = this._eventsMap[event];
    if (!methods.length)
      return () => undefined;

    return (...args: any[]) => {
      Logger.onEvent(event, methods.length);
      const wrapper = this._eventDecomposer.decompose(...args);
      methods.forEach((descriptor) => {
        const dps = injector.resolve(descriptor.params, wrapper);
        try {
          descriptor.fn(...dps, ...args);
          Logger.onSuccessfulMethodCall(descriptor.pluginName, descriptor.name);
        } catch (err) {
          Logger.onFailedMethodCall(descriptor.pluginName, descriptor.name);
          console.log(err);
        }
      });
    };
  }

  /**
   * Attach instance methods to event listeners.
   * 
   * @param instances Map of instances that will be attached to the events.
   * @param client The Discord client.
   * @param injector The injector is required to properly handle the methods dependencies.
   */
  public attachEvents(instances: InstanceMap, client: Discord.Client, injector: Injector): void {
    Logger.startBindingEvents();

    this.mapMethods(instances);
    for (const event in this._eventsMap)
      client.on(event, this.createListener(event as DiscordEvents, injector));
  }
}