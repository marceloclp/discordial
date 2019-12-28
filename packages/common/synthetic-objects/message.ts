import Discord from "discord.js";
import { Scope } from "../enums";
import { Injectable } from "../decorators/injectable";
import { SyntheticObject } from "./synthetic-object";
import { SyntheticUser } from "./user";

@Injectable({ scope: Scope.SYNTHETIC })
export class SyntheticMessage extends SyntheticObject<Discord.Message> {
  get content(): string {
    return this.entity.content;
  }

  get author(): SyntheticUser {
    return new SyntheticUser(this.entity.author);
  }

  reply(text: string): void {
    this.entity.channel.send(text);
  }
}