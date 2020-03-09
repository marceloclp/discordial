import { DiscordEvents } from "../../common/enums";
import { SpreadFunction, Instance } from "../../common/types";
import { getBinding } from "../../common/util/getBinding";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";

type EventWrapper = {
    readonly fns: SpreadFunction[],
}

export class EventsManager {
    // TODO: change this to a cache store that deletes old entries and only keeps
    // the most X recent ones. LRU cache
    private readonly eventsStore = [];

    private readonly eventsMap = new Map<DiscordEvents, EventWrapper>();

    constructor(
        private readonly _logger: LoggerInterface,
    ) {}

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    private getEventWrapper(event: DiscordEvents): EventWrapper {
        if (!this.eventsMap.has(event)) {
            this.eventsMap.set(event, {
                fns: [],
            });
        }
        return this.eventsMap.get(event) as EventWrapper;
    }

    public mapController(controller: Instance<any>): void {
        const { _l } = this;
        const { methods } = getBinding(controller);

        log(_l.onControllerMapping(
            controller.name,
            methods.map(m => ({ name: m.name, event: m.event as string }))
        ));

        for (const method of methods) {
            const { event, target, name } = method;

            if (!event)
                continue;

            const wrapper = this.getEventWrapper(event as DiscordEvents);
            wrapper.fns.push(target[name].bind(target));
        }
    }

    public async execEvent(): Promise<void> {}
}