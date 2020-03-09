export interface DiscordialLoggerInterface {
    onDiscordialStart?: (token: string) => string;

    onDiscordialPluginsLoading?: () => string;

    onDiscordialDestroyStart?: () => string;

    onDiscordialDestroyEnd?: () => string;
}