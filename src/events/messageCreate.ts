import { AudioPlayer } from "@discordjs/voice";
import { Client, Message, MessageCreateOptions } from "discord.js";
import { PREFIX } from "../config";
import { executeAddSong } from "../functions/addSong";
import { executeFindLolMatch } from "../functions/findActiveLolMatch";
import { executeFindLolPlayer } from "../functions/findLolPlayer";
import { executeHello } from "../functions/hello";
import { executePlaySong } from "../functions/playSong";
import { executeSkipSong } from "../functions/skipSong";
import { executeStopSong } from "../functions/stopSong";
import { SongQueue } from "../interfaces/song";

export default (
  client: Client,
  songQueue: SongQueue,
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
      executeStopSong(
        client,
        message.member,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "summoner")) {
      const args = message.content.substring(9);
      executeFindLolPlayer(args, sendReply);
    } else if (message.content.startsWith(PREFIX + "match")) {
      const args = message.content.substring(6);
      executeFindLolMatch(args, sendReply);
    } else if (message.content.startsWith(PREFIX + "hello")) {
      executeHello(client, sendReply);
    }
  });
};
