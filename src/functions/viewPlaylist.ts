import { APIEmbedField, EmbedBuilder } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { sanitizePlaylistID } from "./utils";
import fs = require("fs");
import path = require("path");
import { Song } from "../interfaces/song";

const viewPlaylist = async (playlistID: string): Promise<Song[]> => {
  try {
    const cleanPlaylistID = sanitizePlaylistID(playlistID);
    const file = fs.readFileSync(
      path.join(__dirname, `../../.data/playlistID-${cleanPlaylistID}.data`),
      "utf-8"
    );
    const playlist: Song[] = JSON.parse(file);
    console.log(`playlist data was found for ${cleanPlaylistID}`);
    return playlist;
  } catch (error) {
    const cleanPlaylistID = sanitizePlaylistID(playlistID);
    if (error.code === "ENOENT") {
      console.log(`playlist data does not exist for ${cleanPlaylistID}`);
      return null;
    } else {
      console.log(error);
      return null;
    }
  }
};

export const executeViewPlaylist = async (
  playlistID: string,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (!playlistID) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Playlist ID is missing!")
            .setDescription(
              "Please provide a playlist ID to view the playlist."
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const playlist = await viewPlaylist(playlistID);

    if (!playlist) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Playlist was not found!")
            .setDescription(
              "The provided playlist ID does not exist. View all playlists with `playlist-view-all`"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    if (playlist.length === 0) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Playlist is empty!")
            .setDescription(
              "There are no songs in the playlist. Add some songs with `playlist-add`"
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const songFields: APIEmbedField[] = playlist.map((song, index) => {
      return {
        name: `Song #${index + 1}:`,
        value: `[${song.title}](${song.url})`,
        inline: false,
      };
    });

    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Playlist: ${sanitizePlaylistID(playlistID)}`)
          .setDescription("The songs are listed in order of play")
          .addFields(...songFields)
          .setColor("DarkBlue"),
      ],
    });
  } catch (error) {
    console.log(error);
  }
};
