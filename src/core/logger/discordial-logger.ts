export interface DiscordialLoggerInterface {
    /**
     * It's called once, when Discordial starts the configuration process.
     */
    onDiscordialStart?: (token: string) => string;
    
    /**
     * It's called once, when Discordial successfuly connects to the Discord API.
     */
    onReady?: () => string;
}