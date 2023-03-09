import { EmbedBuilder } from "discord.js";
import { Song, SongQueue } from "../interfaces/song";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import play from "play-dl";

export const addSong = async (
  url: string,
  songQueue: SongQueue
): Promise<Song> => {
  try {
    if (url) {
      if (url.startsWith("https") && play.yt_validate(url) === "playlist") {
        const playlist = await play.playlist_info(url);
        const videos = await playlist.all_videos();

        const songs: Song[] = videos.map((v) => {
          return {
            title: v.title,
            url: v.url,
            thumbnail_url: v.thumbnails[0].url,
          };
        });
        songs.forEach((song) => {
          songQueue.push(song);
        });

        return {
          title: `Playlist - ${playlist.title} - ${songs.length} Songs`,
          url: playlist.url,
          thumbnail_url: playlist.thumbnail.url,
        };
      } else if (url.startsWith("https") && play.yt_validate(url) === "video") {
        const songInfo = await play.video_info(url);

        const song: Song = {
          title: songInfo.video_details.title,
          url: songInfo.video_details.url,
          thumbnail_url: songInfo.video_details.thumbnails[0].url,
        };

        songQueue.push(song);
        return song;
      } else {
        const songInfo = await play.search(url, { limit: 1 });

        const song: Song = {
          title: songInfo[0].title,
          url: songInfo[0].url,
          thumbnail_url: songInfo[0].thumbnails[0].url,
        };

        songQueue.push(song);
        return song;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const executeAddSong = async (
  urlArgs: string,
  songQueue: SongQueue,
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
            "Added " + song.title + " to the queue: #" + songQueue.length()
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
