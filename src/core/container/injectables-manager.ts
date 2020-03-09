import { Token, Target, Instance } from "../../common/types";

/**
 * The Injectables Manager is responsible for storing injectables and instances,
 * and serving to other managers.
 */
export class InjectablesManager {
    static readonly injectables = new Map<Token, Target>();

    private readonly instances = new Map<Token, Instance<any>>();

    public static register(token: Token, target: Target): void {
        if (InjectablesManager.injectables.has(token)) {
            throw new Error(`The injectable <${typeof target}> can only be registered once.`);
        }
        InjectablesManager.injectables.set(token, target);
    }

    public get(token: Token): Target | undefined {
        return InjectablesManager.injectables.get(token);
    }

    public setInstance(token: Token, instance: InstanceType<Target>): void {
        if (this.hasInstance(token)) {
            throw new Error("Injectable instance is being registered twice.");
        }
        this.instances.set(token, instance);
    }

    public getInstance(token: Token): InstanceType<Target> | undefined {
        return this.instances.get(token);
    }

    public hasInstance(token: Token): boolean {
        return this.instances.has(token);
    }
}