import { Message, EmbedBuilder } from "discord.js";

export const executeHello = (message: Message) => {
  message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setDescription("Hello world! Butler Bot is at your service!")
        .setImage(message.client.user.avatarURL())
        .setColor("DarkGreen"),
    ],
  });
};
