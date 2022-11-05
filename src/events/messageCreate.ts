import { AudioPlayer } from "@discordjs/voice";
import { Client, Message, MessageCreateOptions } from "discord.js";
import { prefix } from "../config";
import { executeAddSong } from "../functions/addSong";
import { executeHello } from "../functions/hello";
import { executePlaySong } from "../functions/playSong";
import { executeSkipSong } from "../functions/skipSong";
import { Song } from "../interfaces/song";

export default (
  client: Client,
  songQueue: Song[],
  audioPlayer: AudioPlayer
) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const sendReply = async (options: MessageCreateOptions) => {
      return await message.channel.send(options);
    };

    if (message.content.startsWith(prefix + "play")) {
      const args = message.content.substring(5);
      executePlaySong(
        client,
        message.member,
        args,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(prefix + "skip")) {
      executeSkipSong(message.member, songQueue, audioPlayer, sendReply);
    } else if (message.content.startsWith(prefix + "add")) {
      const args = message.content.substring(4);
      executeAddSong(args, songQueue, sendReply);
    } else if (message.content.startsWith(prefix + "stop")) {
      console.log("stop command");
    } else if (message.content.startsWith(prefix + "replay")) {
      console.log("replay command");
    } else if (message.content.startsWith(prefix + "hello")) {
      executeHello(client, sendReply);
    }
  });
};
