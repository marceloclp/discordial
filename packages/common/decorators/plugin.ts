import { getBinding } from "../utils"

export const DiscordialPlugin = () => (target: any) => {
  getBinding(target, true);
}