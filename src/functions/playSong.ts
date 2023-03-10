import { EmbedBuilder, ChannelType, GuildMember, Client } from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Song, SongQueue } from "../interfaces/song";
import { addSong, executeAddSong } from "./addSong";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import play from "play-dl";

const networkStateChangeHandler = (
  oldNetworkState: any,
  newNetworkState: any
) => {
  const newUdp = Reflect.get(newNetworkState, "udp");
  clearInterval(newUdp?.keepAliveInterval);
};

export const playSong = async (
  connection: VoiceConnection,
  audioPlayer: AudioPlayer,
  songQueue: SongQueue,
  currentSong: Song,
  successReply: (song: Song, remaining: number) => void,
  errorReply: () => void,
  finishReply: () => void
) => {
  try {
    audioPlayer.removeAllListeners();

    if (!currentSong) {
      connection.destroy();
      finishReply();
      return;
    }

    const stream = await play.stream(currentSong.url);

    const audioResource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    audioPlayer.on("stateChange", (oldState, newState) => {
      console.log(newState.status);
      if (newState.status === AudioPlayerStatus.Idle) {
        playSong(
          connection,
          audioPlayer,
          songQueue,
          songQueue.pop(),
          successReply,
          errorReply,
          finishReply
        );
      }
    });

    audioPlayer.on("error", (error) => {
      console.log(error);
      errorReply();
    });

    audioPlayer.play(audioResource);

    successReply(currentSong, songQueue.length());
  } catch (error) {
    console.log(error);
  }
};

export const executePlaySong = async (
  client: Client,
  member: GuildMember,
  urlArg: string,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (songQueue.isEmpty() && !urlArg) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("There is nothing to play!")
            .setDescription(
              "Add a song to the queue first to start playing music"
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const voiceChannel = member.voice.channel;

    if (
      member.guild.channels.cache.some(
        (channel) =>
          channel.type === ChannelType.GuildVoice &&
          channel.members.has(client.user.id)
      )
    ) {
      await executeAddSong(urlArg, songQueue, sendReplyFunction);
      return;
    }

    if (!voiceChannel) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("I can't find you, " + member.nickname)
            .setDescription(
              "You need to be in a voice channel to start playing music"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    const permissions = voiceChannel.permissionsFor(client.user);

    if (!permissions.has("Connect") || !permissions.has("Speak")) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Let me in!")
            .setDescription(
              "I don't have the permissions to join and speak in your voice channel"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on("stateChange", (oldState, newState) => {
      // if (
      //   oldState.status === VoiceConnectionStatus.Ready &&
      //   newState.status === VoiceConnectionStatus.Connecting
      // ) {
      //   connection.configureNetworking();
      // }

      Reflect.get(oldState, "networking")?.off(
        "stateChange",
        networkStateChangeHandler
      );

      Reflect.get(newState, "networking")?.on(
        "stateChange",
        networkStateChangeHandler
      );
    });

    connection.subscribe(audioPlayer);

    if (urlArg) {
      // additional url was given
      const song = await addSong(urlArg, songQueue);
      await sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle(song.title)
            .setURL(song.url)
            .setDescription(
              "Added " + song.title + " to the queue: #" + songQueue.length()
            )
            .setThumbnail(song.thumbnail_url)
            .setColor("DarkGreen"),
        ],
      });
    }

    playSong(
      connection,
      audioPlayer,
      songQueue,
      songQueue.pop(),
      (song, remaining) => {
        sendReplyFunction({
          embeds: [
            new EmbedBuilder()
              .setTitle("Playing " + song.title)
              .setURL(song.url)
              .setDescription(
                "There are " + remaining + " other songs remaining in the queue"
              )
              .setThumbnail(song.thumbnail_url)
              .setColor("DarkGreen"),
          ],
        });
      },
      () => {
        sendReplyFunction({
          embeds: [
            new EmbedBuilder()
              .setTitle("Something went wrong")
              .setDescription(
                "Could not play the requested song.. Moving on to the next song in queue"
              )
              .setColor("DarkRed"),
          ],
        });
      },
      () => {
        sendReplyFunction({
          embeds: [
            new EmbedBuilder()
              .setTitle("I finished my job")
              .setDescription(
                "There are no songs remaining in the queue. Feel free to request me again with new songs"
              )
              .setColor("DarkGreen"),
          ],
        });
      }
    );
  } catch (error) {
    console.log(error);
    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle("Something went wrong")
          .setDescription("Could not add or play the request song...")
          .setColor("DarkRed"),
      ],
    });
  }
};
