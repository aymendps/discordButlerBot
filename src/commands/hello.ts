import {
  CommandInteraction,
  Client,
  InteractionReplyOptions,
} from "discord.js";
import { executeHello } from "../functions/hello";
import { Command } from "../interfaces/command";

export const HelloCommand: Command = {
  name: "hello",
  description: "The first command ever made",
  run: async (client: Client, interaction: CommandInteraction) => {
    executeHello(client, async (options: InteractionReplyOptions) => {
      return await interaction.followUp(options);
    });
  },
};
