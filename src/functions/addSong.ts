import { Client, EmbedBuilder, Message } from "discord.js";
import * as ytdl from "ytdl-core";
import { Song } from "../interfaces/song";

export const addSong = async (message: Message, songQueue: Song[]) => {
  try {
    const args = message.content.split(" ");
    if (args[1]) {
      const songInfo = await ytdl.getInfo(args[1]);
      const song: Song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail_url: songInfo.videoDetails?.thumbnails[0]?.url,
      };
      songQueue.push(song);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Added " + song.title + " to the queue: #" + songQueue.length
            )
            .setThumbnail(song.thumbnail_url)
            .setColor("DarkGreen"),
        ],
      });
    }
  } catch (error) {
    console.log(error);
  }
};
