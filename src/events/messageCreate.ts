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
import { executeAddToFavorites } from "../functions/addToFavorites";
import { executeViewFavorites } from "../functions/viewFavorites";
import { executePlayFavorites } from "../functions/playFavorites";
import {
  executeSearchSong,
  SEARCH_DEFAULT_NUMBER_OF_RESULTS,
} from "../functions/searchSong";
import { executeSuggestSong } from "../functions/suggestSong";
import { executeViewQueue } from "../functions/viewQueue";
import { executeRemoveQueue } from "../functions/removeQueue";
import { executeAddToPlaylist } from "../functions/addToPlaylist";
import { executeViewPlaylist } from "../functions/viewPlaylist";
import { executeViewPlaylistAll } from "../functions/viewPlaylistAll";

export default (
  client: Client,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer
) => {
  client.on("messageCreate", async (message: Message) => {
    const sendReply = async (options: MessageCreateOptions) => {
      const channel = message.channel as TextChannel;
      return await channel.send(options);
    };

    if (
      message.content.includes("good bot") &&
      !message.content.startsWith(PREFIX)
    ) {
      sendReply({ content: ":heart:" });
      return;
    }

    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    if (message.content.startsWith(PREFIX + "play-faves")) {
      const args = message.content.substring(11).trim().split(/\s+/);
      const memberTag = args.filter((a) => a.startsWith("<@"))[0];
      const number = args.filter((a) => !a.startsWith("<@"))[0];
      executePlayFavorites(
        client,
        message.member,
        number,
        memberTag,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "playlist-add")) {
      // prompt would look like this: <playlist-add playlist="playlist name" song="song name/url"
      // should get them using playlist= and song=
      const args = message.content.substring(13).trim();
      const playlistMatch = args.match(/playlist=["']([^"']+)["']/);
      const songMatch = args.match(/song=["']([^"']+)["']/);
      const playlistID = playlistMatch ? playlistMatch[1] : null;
      const songID = songMatch ? songMatch[1] : null;
      executeAddToPlaylist(playlistID, songID, songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "playlist-view-all")) {
      executeViewPlaylistAll(sendReply);
    } else if (message.content.startsWith(PREFIX + "playlist-view")) {
      const args = message.content.substring(14).trim();
      executeViewPlaylist(args, sendReply);
    } else if (message.content.startsWith(PREFIX + "play")) {
      const args = message.content.substring(5).trim();
      executePlaySong(
        client,
        message.member,
        args,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "queue")) {
      executeViewQueue(songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "search")) {
      const args = message.content.substring(7).trim();
      const [name, max] = args.split("max=");
      var boundedMax = Number(max);
      if (isNaN(boundedMax)) {
        boundedMax = SEARCH_DEFAULT_NUMBER_OF_RESULTS;
      } else {
        boundedMax = boundedMax > 10 ? 10 : boundedMax;
        boundedMax = boundedMax < 1 ? 1 : boundedMax;
      }
      executeSearchSong(name, boundedMax, songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "suggest")) {
      sendReply({ content: "Thinking..." });
      const args = message.content.substring(8).trim();
      executeSuggestSong(args, songQueue, sendReply);
    } else if (message.content.startsWith(PREFIX + "skip")) {
      executeSkipSong(
        client,
        message.member,
        songQueue,
        audioPlayer,
        sendReply
      );
    } else if (message.content.startsWith(PREFIX + "add-fave")) {
      executeAddToFavorites(client, message.member, songQueue, sendReply);
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
    } else if (message.content.startsWith(PREFIX + "remove-all")) {
      executeRemoveQueue(songQueue, sendReply);
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
    } else if (message.content.startsWith(PREFIX + "faves")) {
      const args = message.content.substring(6).trim();
      executeViewFavorites(client, message.member, args, sendReply);
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
