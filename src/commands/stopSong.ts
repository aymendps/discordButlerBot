import { AudioPlayer } from "@discordjs/voice";
import {
  CommandInteraction,
  Client,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import { executeSkipSong } from "../functions/skipSong";
import { executeStopSong } from "../functions/stopSong";
import { Command } from "../interfaces/command";
import { Song } from "../interfaces/song";

export const StopSongCommand: Command = {
  name: "stop",
  description: "Stop playing music and emtpy the queue",
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: Song[],
    audioPlayer: AudioPlayer
  ) => {
    executeStopSong(
      client,
      interaction.member as GuildMember,
      songQueue,
      audioPlayer,
      async (options: InteractionReplyOptions) => {
        return await interaction.followUp(options);
      }
    );
  },
};
