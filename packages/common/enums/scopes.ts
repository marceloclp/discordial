export enum Scope {
  /**
   * The provider can only be instantiated once, sharing the same instance
   * across multiple providers and plugins. This is the default behavior.
   */
  SINGLETON = "singleton",

  /**
   * The provider is instantiated every time it is injected into another
   * provider or plugin.
   */
  TRANSIENT = "transient",

  /**
   * Reserved for injecting arguments from a Discord event.
   */
  SYNTHETIC = "synthetic",
};