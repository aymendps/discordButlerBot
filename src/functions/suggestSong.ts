import { ButtonStyle, EmbedBuilder } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { Song, SongQueue } from "../interfaces/song";
import play, { InfoData } from "play-dl";
import {
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
} from "@discordjs/builders";

const SUGGEST_MAX_SONGS = 5;

const suggestSong = async (
  nameArg: string,
  songQueue: SongQueue
): Promise<Song[]> => {
  try {
    let songInfo: InfoData;

    if (!nameArg) {
      const current = songQueue.getCurrent();
      if (!current) {
        return new Array<Song>();
      }
      songInfo = await play.video_basic_info(current.url);
    } else {
      const results = await play.search(nameArg, { limit: 1 });
      songInfo = await play.video_basic_info(results[0].url);
    }

    if (songInfo.related_videos.length > SUGGEST_MAX_SONGS) {
      songInfo.related_videos = songInfo.related_videos.slice(
        0,
        SUGGEST_MAX_SONGS
      );
    }

    const suggestedSongs = new Array<Song>();

    for (let index = 0; index < songInfo.related_videos.length; index++) {
      const songUrl = songInfo.related_videos[index];
      const info = await play.video_basic_info(songUrl);
      suggestedSongs.push({
        title: info.video_details.title,
        url: info.video_details.url,
        thumbnail_url: info.video_details.thumbnails[0].url,
        duration: info.video_details.durationInSec,
        seek: 0,
      });
    }

    return suggestedSongs;
  } catch (error) {
    console.log(error);
    return new Array<Song>();
  }
};

export const executeSuggestSong = async (
  nameArg: string,
  songQueue: SongQueue,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    const suggestedSongs = await suggestSong(nameArg, songQueue);
    if (suggestedSongs.length === 0) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Couldn't suggest any related songs")
            .setDescription(
              "Check if there is a currently playing song or if the song name you provided is correct"
            )
            .setColor("DarkRed"),
        ],
      });
    } else {
      const resultsEmbed = suggestedSongs.map((song, index) => {
        return new EmbedBuilder()
          .setTitle(`Suggested Result #${index + 1}`)
          .setDescription(`[${song.title}](${song.url})`)
          .setThumbnail(song.thumbnail_url)
          .setColor("DarkGreen");
      });

      const buttons = suggestedSongs.map((song, index) =>
        new ButtonBuilder()
          .setLabel(`Queue #${index + 1}`)
          .setStyle(ButtonStyle.Primary)
          .setCustomId(`queue-song-with-index-${index}`)
      );

      const buttonsActionRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          buttons
        );

      const response = await sendReplyFunction({
        embeds: resultsEmbed,
        components: [buttonsActionRow],
      });

      const collector = response.createMessageComponentCollector({
        time: 60000,
      });

      collector.on("collect", async (confirmation) => {
        const index = parseInt(
          confirmation.customId.replace("queue-song-with-index-", "")
        );

        const song = suggestedSongs[index];
        songQueue.push(song);

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

        confirmation.deferUpdate();
      });
    }
  } catch (error) {
    console.log(error);
  }
};
