export interface EventLoggerInterface {
    /**
     * It's called once when Discordial starts binding methods to events.
     */
    onEventsBinding?: (numOfMappedEvents: number, numOfTotalEvents: number) => string;

    /**
     * It's called once for each Discord event that needs to have methods bound to it.
     */
    onEventBinding?: (event: string, numOfMethods: number) => string;

    /**
     * It's called each time a Discord event is triggered.
     */
    onEventTrigger?: (event: string) => string;
}