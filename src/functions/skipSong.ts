import { AudioPlayer } from "@discordjs/voice";
import { ChannelType, Client, EmbedBuilder, GuildMember } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";

export const skipSong = (audioPlayer: AudioPlayer) => {
  const status = audioPlayer.stop();
  return status;
};

export const executeSkipSong = async (
  client: Client,
  member: GuildMember,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (
      !member.guild.channels.cache.some(
        (channel) =>
          channel.type === ChannelType.GuildVoice &&
          channel.members.has(client.user.id)
      )
    ) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("I am not in a voice channel!")
            .setDescription("I was not requested to start playing music yet")
            .setColor("DarkGold"),
        ],
      });
      return;
    }

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

    const song = songQueue.getCurrent();

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
