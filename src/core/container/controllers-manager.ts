import { Constructable, Instance } from "../../common/types";
import { DependencyManager } from "./dependency-manager";
import { getBinding } from "../../common/util/getBinding";
import { BindingType } from "../../common/enums";
import { EventsManager } from "./events-manager";
import { LoggerInterface } from "../logger/logger";
import { log } from "../utils/log";

export class ControllersManager {
    /** Maps a controller constructable to an instance to prevent garbage collection. */
    private readonly _controllers = new Map<Constructable<any>, Instance<any>>();

    private readonly _eventsManager = new EventsManager(this._logger);

    constructor(
        private readonly _logger: LoggerInterface,
        private readonly dependencyManager: DependencyManager,
    ) {}

    private get _l(): NonNullableFields<LoggerInterface> {
        return this._logger as NonNullableFields<LoggerInterface>;
    }

    public get controllers(): Map<Constructable<any>, Instance<any>> {
        return this._controllers;
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

        const { _l } = this;
        log(_l.onControllerInitialization(controller.name));

        const instance = await this.dependencyManager.resolveTarget(controller, plugin);
        this._controllers.set(controller, instance);
        this._eventsManager.mapController(instance);
        
        log(_l.onControllerFinish());
    }
}