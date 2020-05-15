import { Dial } from "../common/interfaces/dial.interface";
import { Container } from "./container";

interface DiscordialOptions {}

export class Discordial {
    private readonly container = new Container();

    constructor(
        private readonly token: string,
        private readonly dials: Dial[],
        private readonly options?: DiscordialOptions
    ) {}

    public async start(): Promise<this> {
        return this;
    }

    /**
     * Loading Discordial consists of the following steps:
     *   1) Loading the Dials.
     *      1.1) For each Dial, load its controllers.
     *      1.2) For each controller, load its providers.
     *   2) For each controller, map its event listeners.
     *   3) Connect to the Discord API.
     */
    private async load(dials: Dial[]): Promise<void> {
        for (const dial of dials) {
            
        }
    }

    /**
     * Destroying Discordial consists of the following steps:
     *   1) Awaiting `onDialDestroy` for each provider and controller.
     *   2) Disconnecting from the Discord API.
     */
    private async destroy(): Promise<void> {}


}