import {
    Channel,
    ClientUserGuildSettings,
    ClientUserSettings,
    Emoji,
    User,
    Guild,
    GuildMember,
    Message,
    MessageReaction,
    RateLimitInfo,
    Role,
    UserResolvable,
    TextChannel
} from "discord.js";

export interface ControllerInterface {
    onChannelCreate?: (channel: Channel, ...dps: any[]) => any

    onChannelDelete?: (channel: Channel, ...dps: any[]) => any;

    onChannelPinsUpdate?: (channel: Channel, ...dps: any[]) => any;

    onClientUserGuildSettingsUpdate?: (clientUserGuildSettings: ClientUserGuildSettings, ...dps: any[]) => any;

    onClientUserSettingsUpdate?: (clientUserSettings: ClientUserSettings, ...dps: any[]) => any;

    onDebug?: (info: string, ...dps: any[]) => any;

    onDisconnect?: (event: any, ...dps: any[]) => any;

    onEmojiCreate?: (emoji: Emoji, ...dps: any[]) => any;

    onEmojiDelete?: (emoji: Emoji, ...dps: any[]) => any;

    onEmojiUpdate?: (emoji: Emoji, ...dps: any[]) => any;

    onError?: (error: Error, ...dps: any[]) => any;

    onGuildBanAdd?: (guild: Guild, user: User, ...dps: any[]) => any;

    onGuildBanRemove?: (guild: Guild, user: User, ...dps: any[]) => any;

    onGuildCreate?: (guild: Guild, ...dps: any[]) => any;

    onGuildDelete?: (guild: Guild, ...dps: any[]) => any;

    onGuildMemberAdd?: (member: GuildMember, ...dps: any[]) => any;

    onGuildMemberAvailable?: (member: GuildMember, ...dps: any[]) => any;

    onGuildMemberRemove?: (member: GuildMember, ...dps: any[]) => any;

    onGuildMembersChunk?: (members: GuildMember[], ...dps: any) => any;

    onGuildMemberSpeaking?: (member: GuildMember, speaking: boolean, ...dps: any) => any;

    onGuildMemberUpdate?: (oldMember: GuildMember, newMember: GuildMember, ...dps: any) => any;

    onGuildUnavailable?: (guild: Guild, ...dps: any) => any;

    onGuildUpdate?: (oldGuild: GuildMember, newGuild?: GuildMember, ...dps: any) => any;

    onGuildIntegrationsUpdate?: (guild: Guild, ...dps: any) => any;

    onMessage?: (message: Message, ...dps: any) => any;

    onMessageDelete?: (message: Message, ...dps: any) => any;

    onMessageDeleteBulk?: (messages: Message[], ...dps: any) => any;

    onMessageReactionAdd?: (messageReaction: MessageReaction, user: User, ...dps: any) => any;

    onMessageReactionRemove?: (messageReacion: MessageReaction, user: User, ...dps: any) => any;

    onMessageReactionRemoveAll?: (message: Message, ...dps: any) => any;

    onMessageUpdate?: (oldMessage: Message, newMessage: Message, ...dps: any) => any;

    onPresenceUpdate?: (oldMember: GuildMember, newMember: GuildMember, ...dps: any) => any;

    onRateLimit?: (rateLimit: RateLimitInfo, ...dps: any) => any;

    onReady?: (...dps: any) => any;

    onReconnecting?: (...dps: any) => any;

    onResume?: (replayed: number, ...dps: any) => any;

    onRoleCreate?: (role: Role, ...dps: any) => any;

    onRoleDelete?: (role: Role, ...dps: any) => any;

    onRoleUpdate?: (oldRole: Role, newRole: Role, ...dps: any) => any;

    onTypingStart?: (channel: Channel, user: User, ...dps: any) => any;

    onTypingStop?: (channel: Channel, user: User, ...dps: any) => any;

    onUserNoteUpdate?: (user: UserResolvable, oldNote: string, newNote: string, ...dps: any) => any;

    onUserUpdate?: (oldUser: User, newUser: User, ...dps: any) => any;

    onVoiceStateUpdate?: (oldMember: GuildMember, newMember: GuildMember, ...dps: any) => any;

    onWarn?: (info: string, ...dps: any) => any;

    onWebhookUpdate?: (channel: TextChannel, ...dps: any) => void;
};

export type ControllerMethod<Event extends keyof ControllerInterface> = ControllerInterface[Event];