import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
  ApplicationCommandOptionType,
} from "discord.js";
import { sendInteractionReply } from ".";
import { executeRemoveSong } from "../functions/removeSong";
import { Command } from "../interfaces/command";
import { SongQueue } from "../interfaces/song";

export const RemoveSongCommand: Command = {
  name: "remove",
  description:
    "Remove added songs from the queue - Removes the last one if no number is passed",
  options: [
    {
      name: "number",
      description: "How many songs to remove from the queue",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: SongQueue
  ) => {
    executeRemoveSong(
      interaction.member as GuildMember,
      songQueue,
      interaction.options.get("number")?.value?.toString()?.trim(),
      async (options: InteractionReplyOptions) => {
        return await sendInteractionReply(interaction, options);
      }
    );
  },
};
