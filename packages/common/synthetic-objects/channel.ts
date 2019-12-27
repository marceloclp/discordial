import Discord from "discord.js";
import { Scope } from "../enums";
import { Injectable } from "../decorators/injectable";
import { SyntheticObject } from "./synthetic-object";

@Injectable({ scope: Scope.SYNTHETIC })
export class SyntheticChannel extends SyntheticObject<Discord.Channel> {}