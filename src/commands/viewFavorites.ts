import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import { sendInteractionReply } from ".";
import { Command } from "../interfaces/command";
import { executeViewFavorites } from "../functions/viewFavorites";

export const ViewFavoritesCommand: Command = {
  name: "faves",
  description: "View songs that were added to your personal favorites",
  run: async (client: Client, interaction: CommandInteraction) => {
    executeViewFavorites(
      client,
      interaction.member as GuildMember,
      async (options: InteractionReplyOptions) => {
        return await sendInteractionReply(interaction, options);
      }
    );
  },
};
