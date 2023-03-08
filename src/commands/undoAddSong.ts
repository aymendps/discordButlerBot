import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import { sendInteractionReply } from ".";
import { executeUndoAddSong } from "../functions/undoAddSong";
import { Command } from "../interfaces/command";
import { SongQueue } from "../interfaces/song";

export const UndoAddSongCommand: Command = {
  name: "undo-add",
  description: "Remove the latest added song from the queue",
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: SongQueue
  ) => {
    executeUndoAddSong(
      interaction.member as GuildMember,
      songQueue,
      async (options: InteractionReplyOptions) => {
        return await sendInteractionReply(interaction, options);
      }
    );
  },
};
