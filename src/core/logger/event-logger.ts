export interface EventLoggerInterface {
    /**
     * It's called each time a Discord event is triggered.
     */
    onEventTrigger?: (event: string) => string;
}