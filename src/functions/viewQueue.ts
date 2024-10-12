import { APIEmbedField, EmbedBuilder } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";

export const executeViewQueue = async (
  songQueue: SongQueue,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (songQueue.isEmpty()) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("The queue is currently empty!")
            .setDescription(
              "Add some songs to the queue using the `play` or `add` command"
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const songFields: APIEmbedField[] = songQueue
      .getAllSongs()
      .map((song, index) => {
        return {
          name: `Song #${index + 1}:`,
          value: `[${song.title}](${song.url})`,
          inline: false,
        };
      });

    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Current Queue:")
          .setDescription("The songs are listed in order of play")
          .addFields(...songFields)
          .setColor("DarkBlue"),
      ],
    });
  } catch (error) {
    console.log(error);
  }
};
