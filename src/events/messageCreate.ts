import { Client, Message } from "discord.js";
import { prefix } from "../config";
import { executeAddSong } from "../functions/addSong";
import { executeHello } from "../functions/hello";
import { Song } from "../interfaces/song";

export default (client: Client, songQueue: Song[]) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + "play")) {
      console.log("play command");
    } else if (message.content.startsWith(prefix + "skip")) {
      console.log("skip command");
    } else if (message.content.startsWith(prefix + "add")) {
      executeAddSong(message, songQueue);
    } else if (message.content.startsWith(prefix + "stop")) {
      console.log("stop command");
    } else if (message.content.startsWith(prefix + "replay")) {
      console.log("replay command");
    } else if (message.content.startsWith(prefix + "hello")) {
      executeHello(message);
    }
  });
};
