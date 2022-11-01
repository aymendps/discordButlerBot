import { Client, EmbedBuilder, Message } from "discord.js";
import * as ytdl from "ytdl-core";
import { Song } from "../interfaces/song";

export const addSong = async (url: string, songQueue: Song[]) => {
  try {
    if (url) {
      const songInfo = await ytdl.getInfo(url);
      const song: Song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail_url: songInfo.videoDetails?.thumbnails[0]?.url,
      };
      songQueue.push(song);
      return song;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const executeAddSong = async (message: Message, songQueue: Song[]) => {
  const args = message.content.split(" ");

  if (!args[1]) {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("Missing song URL. Please try again with a valid URL")
          .setColor("DarkRed"),
      ],
    });
    return;
  }

  const song = await addSong(args[1], songQueue);

  if (song) {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(song.title)
          .setURL(song.url)
          .setDescription(
            "Added " + song.title + " to the queue: #" + songQueue.length
          )
          .setThumbnail(song.thumbnail_url)
          .setColor("DarkGreen"),
      ],
    });
  } else {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("The requested song could not be added / found")
          .setColor("DarkRed"),
      ],
    });
    return;
  }
};
