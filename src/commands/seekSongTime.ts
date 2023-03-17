import { AudioPlayer } from "@discordjs/voice";
import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
  ApplicationCommandOptionType,
} from "discord.js";
import { sendInteractionReply } from ".";
import { executeRemoveSong } from "../functions/removeSong";
import { executeSeekSongTime } from "../functions/seekSongTime";
import { Command } from "../interfaces/command";
import { SongQueue } from "../interfaces/song";

export const SeekSongTimeCommand: Command = {
  name: "seek",
  description: "Seek a timestamp in the current song that's playing",
  options: [
    {
      name: "timestamp",
      description: "Should be one of these formats: HH:MM:SS or MM:SS",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: SongQueue,
    audioPlayer: AudioPlayer
  ) => {
    executeSeekSongTime(
      interaction.member as GuildMember,
      interaction.options.get("timestamp")?.value?.toString()?.trim(),
      songQueue,
      audioPlayer,
      async (options: InteractionReplyOptions) => {
        return await sendInteractionReply(interaction, options);
      }
    );
  },
};
