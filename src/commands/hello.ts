import { CommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command";

export const HelloCommand: Command = {
  name: "hello",
  description: "The first command ever made",
  run: async (client: Client, interaction: CommandInteraction) => {
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription("Hello world! Butler Bot is at your service!")
          .setImage(client.user.avatarURL())
          .setColor("DarkGreen"),
      ],
    });
  },
};
