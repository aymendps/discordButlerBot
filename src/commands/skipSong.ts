import { AudioPlayer } from "@discordjs/voice";
import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import { executeSkipSong } from "../functions/skipSong";
import { Command } from "../interfaces/command";
import { Song } from "../interfaces/song";

export const SkipSongCommand: Command = {
  name: "skip",
  description: "Skip a song and play the next one in the queue",
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: Song[],
    audioPlayer: AudioPlayer
  ) => {
    executeSkipSong(
      interaction.member as GuildMember,
      songQueue,
      audioPlayer,
      async (options: InteractionReplyOptions) => {
        return await interaction.followUp(options);
      }
    );
  },
};
