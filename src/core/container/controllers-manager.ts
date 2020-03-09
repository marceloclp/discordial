import { Constructable, Instance } from "../../common/types";
import { DependenciesManager } from "./dependencies-manager";
import { getBinding } from "../../common/util/getBinding";
import { BindingType } from "../../common/enums";
import { EventsManager } from "./events-manager";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";

export class ControllersManager {
    /** Used as a frequency map and prevents garbage collection. */
    private readonly _controllers = new Map<Constructable<any>, Instance<any>>();

    private readonly _eventsManager = new EventsManager(this._logger, this._dpsManager);

    constructor(
        private readonly _logger: LoggerInterface,
        private readonly _dpsManager: DependenciesManager,
    ) {}

    private get _(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public get eventsManager(): EventsManager {
        return this._eventsManager;
    }

    private has(target: Constructable<any>): boolean {
        return this._controllers.has(target);
    }

    public async resolve(controller: Constructable<any>, plugin: Constructable<any>): Promise<void> {
        if (getBinding(controller).type !== BindingType.CONTROLLER) {
            throw new Error([
                `${controller.name} is not a Controller.`,
                `You likely forgot to add the @Controller decorator.`,
            ].join(' '));
        }

        if (this.has(controller)) {
            throw new Error([
                `${controller.name} already has been instantiated.`,
                `You are probably importing the controller twice.`,
            ].join(' '));
        }

        log(this._.onControllerInitialization(controller.name));

        const instance = await this._dpsManager.resolveTarget(controller, plugin);
        this._controllers.set(controller, instance);
        this._eventsManager.mapController(instance);
        
        log(this._.onControllerFinish());
    }
}