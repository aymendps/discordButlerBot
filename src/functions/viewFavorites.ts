import { Client, EmbedBuilder, GuildMember } from "discord.js";
import { Song } from "../interfaces/song";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import fs = require("fs");
import path = require("path");

export const executeViewFavorites = async (
  client: Client,
  member: GuildMember,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    const file = fs.readFileSync(
      path.join(__dirname, `../../.data/${member.user.username}.data`),
      "utf-8"
    );
    const faves: Song[] = JSON.parse(file);
    const fields = faves.map((song, index) => {
      return {
        name: `Song #${index}`,
        value: `${song.title}\n${song.url}`,
        inline: false,
      };
    });
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${member.nickname}'s faves:`)
          .addFields(fields)
          .setColor("DarkGreen"),
      ],
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Favorites..?")
            .setDescription(
              "You don't have any songs that were added to your favorites!"
            )
            .setColor("DarkGold"),
        ],
      });
    } else {
      console.log(error);
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong")
            .setDescription("Could not find your faves...")
            .setColor("DarkRed"),
        ],
      });
    }
  }
};
