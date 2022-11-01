import { EmbedBuilder, Message, ChannelType } from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { Song } from "../interfaces/song";
import * as ytdl from "ytdl-core";
import { addSong } from "./addSong";

export const playSong = (
  connection: VoiceConnection,
  audioPlayer: AudioPlayer,
  songQueue: Song[],
  currentSong: Song,
  successReply: (song: Song, remaining: number) => void,
  errorReply: () => void,
  finishReply: () => void
) => {
  try {
    if (!currentSong) {
      connection.destroy();
      audioPlayer.removeAllListeners();
      finishReply();
      return;
    }

    const stream = ytdl(currentSong.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    });
    const audioResource = createAudioResource(stream);

    audioPlayer.on("stateChange", (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        songQueue.shift();
        playSong(
          connection,
          audioPlayer,
          songQueue,
          songQueue[0],
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

    successReply(currentSong, songQueue.length - 1);
  } catch (error) {
    console.log(error);
  }
};

export const executePlaySong = async (
  message: Message,
  songQueue: Song[],
  audioPlayer: AudioPlayer
) => {
  try {
    const voiceChannel = message.member.voice.channel;

    if (
      message.guild.channels.cache.some(
        (channel) =>
          channel.type === ChannelType.GuildVoice &&
          channel.members.has(message.client.user.id)
      )
    ) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("I am right there!")
            .setDescription("I am already playing music in a voice channel")
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    if (!voiceChannel) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("I can't find you, " + message.member.nickname)
            .setDescription(
              "You need to be in a voice channel to start playing music"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("Connect") || !permissions.has("Speak")) {
      message.channel.send({
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

    const subscription = connection.subscribe(audioPlayer);

    const args = message.content.split(" ");

    if (args[1]) {
      // additional url was given
      await addSong(args[1], songQueue);
    }

    playSong(
      connection,
      audioPlayer,
      songQueue,
      songQueue[0],
      (song, remaining) => {
        message.channel.send({
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
        message.channel.send({
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
        message.channel.send({
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
  }
};
