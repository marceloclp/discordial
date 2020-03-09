export interface InjectableLoggerInterface {
    /**
     * It's called once when a singleton constructable starts the initialization
     * process.
     * 
     * The loggeable lifecycle of an injectable is:
     *   1) Resolve the constructor dependencies.
     *   2) Instantiate the injectable.
     * 
     */
    onInjectableInitialization?: () => string;

    /**
     * It's called each time a constructor dependency is resolved.
     */
    onInjectableDependencyResolved?: () => string;

    /**
     * It's called once when the injectable is successfully instantiated. If
     * it's a transient injectable, it will be called every time it's
     * instantiated.
     */
    onInjectableInstantiation?: () => string;

    /**
     * It's called once when an injectable's loggeable lifecycle is over.
     */
    onInjectableFinish?: () => string;

    /**
     * It's called once when the Discordial is disconnected.
     */
    onInjectableDestroy?: () => string;
}