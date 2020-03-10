import { BindingType } from "../enums";
import { PluginMetadata, PluginMetadataCtor } from "./plugin-metadata";
import { InjectableMetadata, InjectableMetadataCtor } from "./injectable-metadata";
import { RegisterAsyncMetadata, RegisterAsyncMetadataCtor } from "./register-async-metadata";
import { MethodMetadata } from "./method-metadata";
import { ControllerMetadata, ControllerMetadataCtor } from "./controller-metadata";

export class Binding {
    constructor (
        /** 2-way reference between the metadata and the constructable. */
        private readonly _target: Constructable,
    ) {}

    /** The type is used to make sure the container is initializing valid constructables. */
    private _type?: BindingType;

    /** If the constructable is a plugin, then it has plugin metadata. */
    private _plugin?: PluginMetadata;

    /** If the constructable is a plugin, then it has controller metadata. */
    private _controller?: ControllerMetadata;

    /** If the constructable is an injectable, then it has injectable metadata. */
    private _injectable?: InjectableMetadata;

    /** If the constructable can be registered async, then it has registerAsync metadata. */
    private _registerAsync?: RegisterAsyncMetadata;

    /** References the constructable methods. Required for binding events. */
    private _methods: Record<string, MethodMetadata> = {};

    public get target(): Constructable {
        return this._target;
    }

    public get type(): BindingType {
        return this._type as BindingType;
    }

    public get plugin(): PluginMetadata {
        return this._plugin as PluginMetadata;
    }

    public get controller(): ControllerMetadata {
        return this._controller as ControllerMetadata;
    }

    public get injectable(): InjectableMetadata {
        return this._injectable as InjectableMetadata;
    }

    public get registerAsync(): RegisterAsyncMetadata | undefined {
        return this._registerAsync;
    }

    public get methods(): MethodMetadata[] {
        return Object.values(this._methods);
    }

    public get ctor(): RegisterAsyncMetadata | MethodMetadata {
        if (this.registerAsync && this.registerAsync.transformerFn)
            return this.registerAsync
        if (!this._methods["undefined"])
            this.getMethod("undefined");
        return this._methods["undefined"];
    }

    public setPlugin(...args: PluginMetadataCtor): PluginMetadata {
        this._type = BindingType.PLUGIN;
        this._plugin = new PluginMetadata(...args);
        return this._plugin;
    }

    public setController(...args: ControllerMetadataCtor): ControllerMetadata {
        this._type = BindingType.CONTROLLER;
        this._controller = new ControllerMetadata(...args);
        return this._controller;
    }

    public setInjectable(...args: InjectableMetadataCtor): InjectableMetadata {
        this._type = BindingType.INJECTABLE;
        this._injectable = new InjectableMetadata(...args);
        return this._injectable;
    }

    public setRegisterAsync(...args: RegisterAsyncMetadataCtor): RegisterAsyncMetadata {
        this._registerAsync = new RegisterAsyncMetadata(...args);
        return this._registerAsync;
    }

    public getMethod(name: string): MethodMetadata {
        if (!this._methods[name])
            this._methods[name] = new MethodMetadata(this._target, name);
        return this._methods[name];
    }
}