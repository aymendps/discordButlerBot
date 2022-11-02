import { AudioPlayer } from "@discordjs/voice";
import {
  CommandInteraction,
  Client,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { skipSong } from "../functions/skipSong";
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
    try {
      const member = interaction.member as GuildMember;

      if (songQueue.length === 0) {
        interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle("The queue is already empty!")
              .setDescription(
                "There is no song that I could skip, " + member.nickname
              )
              .setColor("DarkGold"),
          ],
        });
        return;
      }

      const song = songQueue[0];

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle("Skipping " + song.title)
            .setURL(song.url)
            .setDescription("This song was skipped by " + member.nickname)
            .setThumbnail(song.thumbnail_url)
            .setColor("DarkBlue"),
        ],
      });

      skipSong(audioPlayer, songQueue);
    } catch (error) {
      console.log(error);
    }
  },
};
