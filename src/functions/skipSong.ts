import { AudioPlayer } from "@discordjs/voice";
import { EmbedBuilder, GuildMember } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";

export const skipSong = (audioPlayer: AudioPlayer) => {
  const status = audioPlayer.stop(true);
  return status;
};

export const executeSkipSong = async (
  member: GuildMember,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (songQueue.isEmpty()) {
      sendReplyFunction({
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

    const song = songQueue.front();

    await sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Skipping " + song.title)
          .setURL(song.url)
          .setDescription("This song was skipped by " + member.nickname)
          .setThumbnail(song.thumbnail_url)
          .setColor("DarkBlue"),
      ],
    });

    skipSong(audioPlayer);
  } catch (error) {
    console.log(error);
  }
};
