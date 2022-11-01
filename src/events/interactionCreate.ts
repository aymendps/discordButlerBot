import { Client, Interaction, CommandInteraction } from "discord.js";
import { Commands } from "../commands";

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
) => {
  const slashCommand = Commands.find(
    (command) => command.name === interaction.commandName
  );

  if (!slashCommand) {
    console.error(
      "Command " +
        interaction.commandName +
        " was not found in available Commands"
    );
    return;
  }

  await interaction.deferReply();

  slashCommand.run(client, interaction);
};

export default (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};
