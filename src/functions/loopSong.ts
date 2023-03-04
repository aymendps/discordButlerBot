import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { SongQueue } from "../interfaces/song";
import { EmbedBuilder } from "discord.js";

export const executeLoopSong = async (
  songQueue: SongQueue,
  sendReplyFunction: sendReplyFunction
) => {
  const status = songQueue.toggleLooping();

  await sendReplyFunction({
    embeds: [
      new EmbedBuilder()
        .setTitle(`Loop Mode is ${status.isLooping ? "Enabled" : "Disabled"}`)
        .setDescription(
          status.isLooping
            ? status.loopedSong
              ? `Playing the song "${status.loopedSong.title}" as long as loop mode is enabled`
              : "Add a song to the queue to play it as long as loop mode is enabled"
            : `Playing the songs in the queue with the normal behaviour`
        )
        .setColor("DarkBlue"),
    ],
  });
};
