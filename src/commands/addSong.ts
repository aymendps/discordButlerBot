import {
  CommandInteraction,
  Client,
  EmbedBuilder,
  ApplicationCommandOptionType,
} from "discord.js";
import { addSong } from "../functions/addSong";
import { Command } from "../interfaces/command";
import { Song } from "../interfaces/song";

export const AddSongCommand: Command = {
  name: "add",
  description: "Add a song to the queue",
  options: [
    {
      name: "url",
      description: "The URL of the song to be added",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: Song[]
  ) => {
    const url = interaction.options.get("url", true);
    if (!url || !url.value) {
      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Missing song URL. Please try again with a valid URL"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    const song = await addSong(url.value as string, songQueue);

    if (song) {
      interaction.followUp({
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
      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription("The requested song could not be added / found")
            .setColor("DarkRed"),
        ],
      });
      return;
    }
  },
};
