export interface DiscordialLoggerInterface {
    onReady?: () => string;

    onDiscordialStart?: (token: string) => string;

    onDiscordialPluginsLoading?: () => string;

    onDiscordialDestroyStart?: () => string;

    onDiscordialDestroyEnd?: () => string;
}