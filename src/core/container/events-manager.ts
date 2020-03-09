import Discord from "discord.js";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { getBinding } from "../../common/util/getBinding";
import { DiscordEvents } from "../../common/enums";
import { log } from "../utils/log";

type EventsMap = Map<DiscordEvents, EventWrapper>;

type EventWrapper = { readonly fns: CallableFunction[] };

export class EventsManager {
    // TODO: change this to a cache store that deletes old entries and only keeps
    // the most X recent ones. LRU cache
    private readonly _eventsStore = [];

    /** Maps Discord events to the controller methods. */
    private readonly _eventsMap: EventsMap = new Map();

    constructor(
        private readonly _logger: LoggerInterface,

        private readonly _dpsManager: DependenciesManager,
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    /**
     * Returns the entry in the events map corresponding to the requested event,
     * and intializes an entry if none exists.
     * 
     * @param {String} event - The name of the event to be requested.
     * 
     * @returns An event wrapper.
     */
    private getEventWrapper(event: DiscordEvents): EventWrapper {
        if (!this._eventsMap.has(event)) {
            this._eventsMap.set(event, {
                fns: [],
            });
        }
        return this._eventsMap.get(event) as EventWrapper;
    }

    /**
     * Maps a controller methods to the corresponding Discord events.
     * 
     * @param controller - The controller instance to be mapped.
     */
    public mapController(controller: any): void {
        const { methods } = getBinding(controller);

        log(this._.onControllerMapping(
            controller.name,
            methods.map(m => ({ name: m.name, event: m.event as string }))
        ));

        for (const { event, target, name} of methods) {
            if (!event)
                continue;
            const wrapper = this.getEventWrapper(event as DiscordEvents);
            wrapper.fns.push(target[name].bind(target));
        }
    }

    /**
     * Binds the mapped methods to the Discord client event listeners.
     * 
     * @param {Discord.Client} client - The Discord client.
     */
    public bindEvents(client: Discord.Client): void {}
}