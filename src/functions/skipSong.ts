import { AudioPlayer } from "@discordjs/voice";
import { EmbedBuilder, Message } from "discord.js";
import { Song } from "../interfaces/song";

export const skipSong = (audioPlayer: AudioPlayer, songQueue: Song[]) => {
  const status = audioPlayer.stop(true);
  return status;
};

export const executeSkipSong = async (
  message: Message,
  songQueue: Song[],
  audioPlayer: AudioPlayer
) => {
  try {
    if (songQueue.length === 0) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("The queue is already empty!")
            .setDescription(
              "There is no song that I could skip, " + message.member.nickname
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const song = songQueue[0];

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Skipping " + song.title)
          .setURL(song.url)
          .setDescription("This song was skipped by " + message.member.nickname)
          .setThumbnail(song.thumbnail_url)
          .setColor("DarkBlue"),
      ],
    });

    skipSong(audioPlayer, songQueue);
  } catch (error) {
    console.log(error);
  }
};
