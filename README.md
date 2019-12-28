<p align="center">
<img src="https://i.imgur.com/AR37Vu4.png" alt="Discordial" height="200px" >
</p>

Logo made by the talented [Lucas Souto](https://www.behance.net/LUCASSOUTOO").

Discordial is a framework for building Discord bots. It makes use of the advantages of TypeScript and combines elements of OOP (Object Oriented Programming) and FP (Functional Programming).

Discordial is built using the [IoC (Inversion of Control)](https://en.wikipedia.org/wiki/Inversion_of_control) design pattern, and focus on modularity and ease of use. Adding functionality to your bot is as easy as downloading a module and writing a single line of code.

You should probably read the [wiki](https://github.com/marceloclp/discordial/wiki).


## Example (or check out the [example repo](https://github.com/marceloclp/discordial-example))
Discordial works by registering plugins during your Discordial instantiation. To register plugins, simply append them to the plugins array.
```ts
// src/index.ts
import { Discordial } from "discordial";
import { PrefixPlugin } from "./prefix/prefix.plugin";

const token = "your discord bot token";
const discordial = new Discordial(token, {
  plugins: [PrefixPlugin] // <= PrefixPlugin is now registered.
});
```

Now let's take a look at what `PrefixPlugin` looks like. A Discordial Plugin is the controller which maps discord events to functions using the `@BindEvent()` decorator. A Discordial Plugin takes the `@DiscordialPlugin()` decorator at the top.
```ts
// src/prefix/prefix.plugin.ts
import { Message } from "discord.js";
import { DiscordialPlugin, BindEvent, DiscordEvents, Inject, Message, SyntheticMessage } from "discordial";
import { PrefixService } from "./prefix.service";

@DiscordialPlugin()
export class PrefixPlugin {
  constructor(
    // Discordial will instantiate and manage your services for you.
    @Inject(PrefixService) private readonly prefixService: PrefixService,
  ) {}

  // `replyWithPong()` will be called on every new message.
  @BindEvent(DiscordEvents.MESSAGE)
  public replyWithPong(
    // You can inject synthetic objects with the help of decorators:
    @Message() syntheticMessage: SyntheticMessage,
    // Or simply get the default parameters from the listener:
    message: Message,
  ) {
    this.prefixService.replyWithPong(syntheticMessage);
  }
}
```

Services can be used to separate concerns and create scalable applications. To declare a service, use the `@Injectable()` decorator. Let's take a look at our `PrefixService`.
```ts
// src/prefix/prefix.service.ts
import { Injectable, SyntheticMessage } from "discordial";

@Injectable()
export class PrefixService {
  private readonly _prefix = "!";

  private isValid(message: SyntheticMessage, command: string): boolean {
    if (!message.content.startsWith(this._prefix + command))
      return false;
    return !message.author.bot;
  }

  public replyWithPong(message: SyntheticMessage): void {
    if (!this.isValid(message, "ping"))
      return;
    message.reply("pong");
  }
}
```

## Features

* Built using the IoC design pattern.

* Shares similarities with AngularJS and NestJS. If you have experience with any of those frameworks, Discordial becomes that much easier to use.

* **Synthetic objects:** Discordial offers custom interfaces for manipulating the event parameters with improved functionality. Synthetic objects can also be replaced by awesome community made creations. ~~Well, not yet... but that's the plan! :)~~
