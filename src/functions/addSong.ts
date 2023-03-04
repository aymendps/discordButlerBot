import {
  EmbedBuilder,
  InteractionReplyOptions,
  Message,
  MessageCreateOptions,
} from "discord.js";
import * as ytdl from "ytdl-core";
import { Song } from "../interfaces/song";
import { youtube } from "scrape-youtube";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";

export const addSong = async (url: string, songQueue: Song[]) => {
  try {
    if (url) {
      let song: Song = null;
      if (url.includes("www.youtube.com")) {
        const songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          thumbnail_url: songInfo.videoDetails?.thumbnails[0]?.url,
        };
      } else {
        const { videos } = await youtube.search(url, { type: "any" });
        if (videos[0]) {
          song = {
            title: videos[0].title,
            url: videos[0].link,
            thumbnail_url: videos[0].thumbnail,
          };
        }
      }
      if (song) {
        songQueue.push(song);
        return song;
      } else {
        throw "No valid song was found";
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const executeAddSong = async (
  urlArgs: string,
  songQueue: Song[],
  sendReplyFunction: sendReplyFunction
) => {
  if (!urlArgs) {
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setDescription("Missing song URL. Please try again with a valid URL")
          .setColor("DarkRed"),
      ],
    });
    return;
  }

  const song = await addSong(urlArgs, songQueue);

  if (song) {
    sendReplyFunction({
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
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setDescription("The requested song could not be added / found")
          .setColor("DarkRed"),
      ],
    });
    return;
  }
};
