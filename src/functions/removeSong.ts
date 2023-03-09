import { EmbedBuilder, GuildMember } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";

export const executeRemoveSong = async (
  member: GuildMember,
  songQueue: SongQueue,
  howMany: string,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    const removedSongs: number = howMany
      ? songQueue.remove(parseInt(howMany))
      : songQueue.remove();

    if (removedSongs === 0) {
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
          .setTitle(`Removed ${removedSongs} songs from the queue`)
          .setDescription(
            `There are ${songQueue.length()} other songs remaining in the queue`
          )
          .setColor("DarkBlue"),
      ],
    });
  } catch (error) {
    console.log(error);
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Something went wrong")
          .setDescription("Could not remove songs from the queue...")
          .setColor("DarkRed"),
      ],
    });
  }
};
