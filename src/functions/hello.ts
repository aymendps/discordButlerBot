import {
  Message,
  EmbedBuilder,
  MessageCreateOptions,
  InteractionReplyOptions,
  Client,
} from "discord.js";

export const executeHello = (
  client: Client,
  sendReplyFunction: (
    options: MessageCreateOptions | InteractionReplyOptions
  ) => Promise<Message>
) => {
  sendReplyFunction({
    embeds: [
      new EmbedBuilder()
        .setDescription("Hello world! Butler Bot is at your service!")
        .setImage(client.user.avatarURL())
        .setColor("DarkGreen"),
    ],
  });
};
