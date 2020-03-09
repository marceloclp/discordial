export interface ControllerLoggerInterface {
    /**
     * It's called once when a controller constructable starts its
     * initialization process.
     * 
     * The loggeable lifecycle of a controller is:
     *   1) Resolve the constructor dependencies.
     *   2) Instantiate the controller.
     *   3) Map the instance methods to the Discord events.
     * 
     */
    onControllerInitialization?: (controllerName?: string) => string;

    /**
     * It's called once after the controller is instantiated, to log the start
     * of methods to events mapping process.
     */
    onControllerMapping?: (controllerName?: string, methods?: { name: string, event: string }[]) => string;

    /**
     * It's called once when a controller's loggeable lifecycle is over.
     */
    onControllerFinish?: (controllerName?: string) => string;

    /**
     * It's called once when the Discordial is disconnected.
     */
    onControllerDestroy?: (controllerName?: string) => string;
};