export interface ControllerLoggerInterface {
    /**
     * It's called once, when a controller starts loading.
     */
    onControllerStart?: (controllerName: string, numOfDps: number) => string;

    /**
     * It's called once after the controller is instantiated, and it starts the
     * mapping process of its methods.
     */
    onControllerMapping?: (controllerName: string, numOfMethods: number) => string;
};