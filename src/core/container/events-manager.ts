import Discord, { Message } from "discord.js";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { getBinding } from "../../common/util/getBinding";
import { DiscordEvents } from "../../common/enums";
import { log } from "../utils/log";
import { MethodMetadataRoles } from "../../common/interfaces/method-metadata-roles";
import { ParamMetadata } from "../../common/metadata/param-metadata";

type RolesIterator = IterableIterator<[string, Discord.Role]>;

type EventsMap = Map<DiscordEvents, EventWrapper[]>;

interface EventWrapper {
    readonly fn: CallableFunction;

    readonly roles: MethodMetadataRoles;

    readonly params: ParamMetadata[]
};

export class EventsManager {
    /** Maps Discord events to the controller methods. */
    private readonly _eventsMap: EventsMap = new Map();

    private _discordClient?: Discord.Client;

    constructor(
        private readonly _logger: LoggerInterface,

        private readonly _dpsManager: DependenciesManager,
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    private get client(): Discord.Client {
        return this._discordClient as Discord.Client;
    }

    private setClient(client: Discord.Client): void {
        this._discordClient = client;
    }

    /**
     * Returns the entry in the events map corresponding to the requested event,
     * and intializes an entry if none exists.
     * 
     * @param {String} event - The name of the event to be requested.
     * 
     * @returns An event wrapper array.
     */
    private getEventWrapper(event: DiscordEvents): EventWrapper[] {
        if (!this._eventsMap.has(event))
            this._eventsMap.set(event, []);
        return this._eventsMap.get(event) as EventWrapper[];
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

        for (const method of methods) {
            const { event, target, name, roles, params } = method;
            if (!event)
                continue;
            this.getEventWrapper(event as DiscordEvents)
                .push({
                    fn: target[name].bind(target),
                    roles,
                    params,
                });
        }
    }

    /**
     * Binds the mapped methods to the Discord client event listeners.
     * 
     * @param {Discord.Client} client - The Discord client.
     */
    public bindEvents(client: Discord.Client): void {
        this.setClient(client);
        for (const [event, arr] of this._eventsMap.entries()) {
            client.on(event as string, (...args: any[]) => {
                arr.forEach(wrapper => this.execMethod(event, wrapper, ...args));
            });
        }
    }

    /**
     * Checks if a user has at least one role from a Set of roles. The role
     * equality is evaluated through the role's name.
     * 
     * @param {Set}      roles    - The set of roles.
     * @param {Iterator} iterator - The user roles as an iterator.
     * 
     * @returns Whether the user has at least one role.
     */
    private hasOneRole(roles: Set<string>, iterator: RolesIterator): boolean {
        for (const [key, role] of iterator)
            if (roles.has(role.name))
                return true;
        return false;
    }

    /**
     * Checks if a user has all roles from a Set of roles. The role equality is
     * evaluated through the role's name.
     * 
     * @param {Set}      roles    - The set of roles.
     * @param {Iterator} iterator - The user roles as an iterator.
     * 
     * @returns Whether the user has all roles.
     */
    private hasAllRoles(roles: Set<string>, iterator: RolesIterator): boolean {
        let rolesFound = 0;
        for (const [key, role] of iterator)
            if (roles.has(role.name))
                if (++rolesFound === roles.size)
                    return true;
        return false;
    }

    /**
     * Evalutes if a user's roles is enough to access an endpoint. Currently
     * only works on events of type `message`.
     * 
     * @param {DiscordEvents} event   - The discord event.
     * @param {EventWrapper}  wrapper - The event wrapper.
     * @param {Message}       message - The Discord message from the event listener.
     * 
     * @returns Whether the user can access the endpoint.
     */
    private resolveGuards(event: DiscordEvents, wrapper: EventWrapper, message?: Discord.Message): boolean {
        if (![DiscordEvents.MESSAGE].includes(event) || !message)
            return true;
        
        const getIterator = () => message.member.roles.entries();
        const { allow, block, onlyAllowAll, onlyBlockAll } = wrapper.roles;
        
        if (allow && !this.hasOneRole(allow, getIterator()))
            return false;
        else if (block && this.hasOneRole(block, getIterator()))
            return false;
        else if (onlyAllowAll && !this.hasAllRoles(onlyAllowAll, getIterator()))
            return false;
        else if (onlyBlockAll && this.hasAllRoles(onlyBlockAll, getIterator()))
            return false;
        return true;
    }

    // TODO: resolve method dependencies
    private async execMethod(event: DiscordEvents, wrapper: EventWrapper, ...args: any[]): Promise<void> {
        if (!this.resolveGuards(event, wrapper, args.length && args[0]))
            return;
        const { fn, params } = wrapper;
        const dps = await this._dpsManager.resolveMethodDps(params);
        fn(...args, ...dps);
    }
}