import { AudioPlayer } from "@discordjs/voice";
import { Client, Message, MessageCreateOptions, TextChannel } from "discord.js";
import { PREFIX } from "../config";
import { executeAddSong } from "../functions/addSong";
import { executeFindLolMatch } from "../functions/findActiveLolMatch";
import { executeFindLolPlayer } from "../functions/findLolPlayer";
import { executeHello } from "../functions/hello";
import { executeLoopSong } from "../functions/loopSong";
import { executePlaySong } from "../functions/playSong";
import { executeSkipSong } from "../functions/skipSong";
import { executeStopSong } from "../functions/stopSong";
import { executeRemoveSong } from "../functions/removeSong";
import { SongQueue } from "../interfaces/song";
import { executeSeekSongTime } from "../functions/seekSongTime";

export default (
  client: Client,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer
) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const sendReply = async (options: MessageCreateOptions) => {
      const channel = message.channel as TextChannel;
      return await channel.send(options);
    };

    if (message.content.startsWith(PREFIX + "play")) {
      const args = message.content.substring(5).trim();
      executePlaySong(
        client,
        message.member,
        args,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "skip")) {
      executeSkipSong(
        client,
        message.member,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "add")) {
      const args = message.content.substring(4).trim();
      executeAddSong(args, songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "stop")) {
      executeStopSong(
        client,
        message.member,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "loop")) {
      executeLoopSong(songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "remove")) {
      const args = message.content.substring(7).trim();
      executeRemoveSong(message.member, songQueue, args, sendReply);
    } else if (message.content.startsWith(PREFIX + "seek")) {
      const args = message.content.substring(5).trim();
      executeSeekSongTime(
        message.member,
        args,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "summoner")) {
      const args = message.content.substring(9).trim();
      executeFindLolPlayer(args, sendReply);
    } else if (message.content.startsWith(PREFIX + "match")) {
      const args = message.content.substring(6).trim();
      executeFindLolMatch(args, sendReply);
    } else if (message.content.startsWith(PREFIX + "hello")) {
      executeHello(client, sendReply);
    }
  });
};
