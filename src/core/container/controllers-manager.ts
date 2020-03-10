import { EventsManager } from "./events-manager";
import { DependenciesManager } from "./dependencies-manager";
import { LoggerInterface } from "../logger/logger";
import { Constructable, Instance } from "../../common/types";
import { BindingType } from "../../common/enums";
import { getBinding } from "../../common/util/getBinding";
import { log } from "../utils/log";
import { MethodMetadata } from "../../common/metadata/method-metadata";

export class ControllersManager {
    /** Used as a frequency map and prevents garbage collection. */
    private readonly _controllersMap = new Map<Constructable<any>, Instance<any>>();

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

    /**
     * Checks if a controller has already been instantiated.
     * 
     * @param {Constructable} controller - The controller constructable to be checked.
     * 
     * @returns a boolean indicating if it has been instantiated.
     */
    private has(controller: Constructable<any>): boolean {
        return this._controllersMap.has(controller);
    }

    /**
     * Resolves a controller instance by instantiating its dependencies, and
     * mapping its methods to Discord events.
     * 
     * @param {Constructable} controller - The controller constructable to be resolved.
     * @param {Constructable} plugin     - The plugin who owns the controller.
     * 
     * @returns The controller instance.
     */
    public async resolve(controller: Constructable<any>, plugin: Constructable<any>): Promise<any> {
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

        const numOfDps = (getBinding(controller).ctor as MethodMetadata).params.length;
        log(() => this._.onControllerStart(controller.name, numOfDps));

        const instance = await this._dpsManager.resolveTarget(controller, plugin);
        this._controllersMap.set(controller, instance);
        this._eventsManager.mapController(instance);

        return instance;
    }
}