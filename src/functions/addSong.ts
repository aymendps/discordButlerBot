import { EmbedBuilder } from "discord.js";
import { Song, SongQueue } from "../interfaces/song";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import play, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack } from "play-dl";

const checkForTimeStamp = (url: string, songDuration: number) => {
  const index = url.indexOf("t=");

  if (index === -1) return Number(0);

  const seconds = Number(url.substring(index, url.length).replace(/\D/g, ""));

  if (seconds > Number(songDuration)) {
    return Number(0);
  }

  return seconds;
};

export const addSong = async (
  url: string,
  songQueue: SongQueue
): Promise<Song> => {
  try {
    if (url) {
      console.log("requested song: " + url);

      if (url.startsWith("https") && play.yt_validate(url) === "playlist") {
        const playlist = await play.playlist_info(url);
        const videos = await playlist.all_videos();

        const songs: Song[] = videos.map((v) => {
          return {
            title: v.title,
            url: v.url,
            thumbnail_url: v.thumbnails[0].url,
            duration: v.durationInSec,
          };
        });
        songs.forEach((song) => {
          songQueue.push(song);
        });

        return {
          title: `Playlist - ${playlist.title} - ${songs.length} Songs`,
          url: playlist.url,
          thumbnail_url: playlist.thumbnail
            ? playlist.thumbnail.url
            : songs[0].thumbnail_url,
          duration: songs[0].duration,
        };
      } else if (url.startsWith("https") && play.yt_validate(url) === "video") {
        const songInfo = await play.video_info(url);

        const song: Song = {
          title: songInfo.video_details.title,
          url: songInfo.video_details.url,
          thumbnail_url: songInfo.video_details.thumbnails[0].url,
          duration: songInfo.video_details.durationInSec,
          seek: checkForTimeStamp(url, songInfo.video_details.durationInSec),
        };

        songQueue.push(song);
        return song;
      } else if (url.startsWith("https") && url.includes("spotify")) {
        if (play.is_expired()) {
          await play.refreshToken();
        }

        const songInfo = await play.spotify(url);

        if (songInfo.type === "track") {
          const track = songInfo as SpotifyTrack;
          const song: Song = {
            title: track.name,
            url: track.url,
            thumbnail_url: track.thumbnail.url,
            duration: track.durationInSec,
          };

          songQueue.push(song);
          return {
            title: `Track - ${track.name}`,
            url: track.url,
            thumbnail_url: track.thumbnail.url,
            duration: track.durationInSec,
          };
        } else if (songInfo.type === "album") {
          const album = songInfo as SpotifyAlbum;
          const albumTracks = await album.all_tracks();

          const songs: Song[] = albumTracks.map((t) => {
            return {
              title: t.name,
              url: t.url,
              thumbnail_url: t.thumbnail
                ? t.thumbnail.url
                : album.thumbnail.url,
              duration: t.durationInSec,
            };
          });

          console.log(songs);

          songs.forEach((song) => {
            songQueue.push(song);
          });
          return {
            title: `Album - ${album.name} - ${songs.length} Tracks`,
            url: album.url,
            thumbnail_url: album.thumbnail.url,
            duration: songs[0].duration,
          };
        } else if (songInfo.type === "playlist") {
          const playlist = songInfo as SpotifyPlaylist;
          const playlistTracks = await playlist.all_tracks();

          const songs: Song[] = playlistTracks.map((t) => {
            return {
              title: t.name,
              url: t.url,
              thumbnail_url: t.thumbnail
                ? t.thumbnail.url
                : playlist.thumbnail.url,
              duration: t.durationInSec,
            };
          });

          songs.forEach((song) => {
            songQueue.push(song);
          });
          return {
            title: `Playlist - ${playlist.name} - ${songs.length} Tracks`,
            url: playlist.url,
            thumbnail_url: playlist.thumbnail.url,
            duration: songs[0].duration,
          };
        }
      } else {
        const songInfo = await play.search(url, { limit: 1 });

        const song: Song = {
          title: songInfo[0].title,
          url: songInfo[0].url,
          thumbnail_url: songInfo[0].thumbnails[0].url,
          duration: songInfo[0].durationInSec,
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
          .setDescription(
            "The requested song could not be added / found. Make sure the URL is valid!"
          )
          .setColor("DarkRed"),
      ],
    });
    return;
  }
};
