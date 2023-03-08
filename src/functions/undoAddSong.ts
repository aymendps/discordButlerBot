import { EmbedBuilder, GuildMember } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";

export const executeUndoAddSong = async (
  member: GuildMember,
  songQueue: SongQueue,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    const song = songQueue.undoPush();

    if (!song) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("The queue is already empty!")
            .setDescription(
              "There is no song that I could remove, " + member.nickname
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    await sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Removed " + song.title + " from the queue")
          .setURL(song.url)
          .setDescription(
            "This recently added song was removed by " + member.nickname
          )
          .setThumbnail(song.thumbnail_url)
          .setColor("DarkBlue"),
      ],
    });
  } catch (error) {
    console.log(error);
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Something went wrong")
          .setDescription(
            "Could not remove the recently added song from the queue..."
          )
          .setColor("DarkRed"),
      ],
    });
  }
};
