import { AudioPlayer } from "@discordjs/voice";
import { Client, Message, MessageCreateOptions } from "discord.js";
import { PREFIX } from "../config";
import { executeAddSong } from "../functions/addSong";
import { executeHello } from "../functions/hello";
import { executePlaySong } from "../functions/playSong";
import { executeSkipSong } from "../functions/skipSong";
import { executeStopSong } from "../functions/stopSong";
import { Song } from "../interfaces/song";

export default (
  client: Client,
  songQueue: Song[],
  audioPlayer: AudioPlayer
) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const sendReply = async (options: MessageCreateOptions) => {
      return await message.channel.send(options);
    };

    if (message.content.startsWith(PREFIX + "play")) {
      const args = message.content.substring(5);
      executePlaySong(
        client,
        message.member,
        args,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "skip")) {
      executeSkipSong(message.member, songQueue, audioPlayer, sendReply);
    } else if (message.content.startsWith(PREFIX + "add")) {
      const args = message.content.substring(4);
      executeAddSong(args, songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "stop")) {
      const args = message.content.substring(4);
      executeStopSong(
        client,
        message.member,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "replay")) {
      console.log("replay command");
    } else if (message.content.startsWith(PREFIX + "hello")) {
      executeHello(client, sendReply);
    }
  });
};
