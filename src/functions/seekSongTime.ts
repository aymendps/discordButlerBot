import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import { EmbedBuilder, GuildMember } from "discord.js";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import { Song, SongQueue } from "../interfaces/song";
import play, { YouTubeStream } from "play-dl";

const TIMESTAMP_REGEX = /(?:([0-5][0-9]):)?([0-5][0-9]):([0-5][0-9])/;

const convertTimeStampToSeconds = (timestamp: string) => {
  var seconds = Number(0);
  var multiplier = Number(1);

  while (timestamp.length !== 0) {
    seconds +=
      Number(timestamp.substring(timestamp.length - 2, timestamp.length)) *
      multiplier;

    multiplier *= Number(60);

    timestamp = timestamp.slice(0, -3);
  }

  return seconds;
};

export const executeSeekSongTime = async (
  member: GuildMember,
  timestamp: string,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    const voiceChannel = member.voice.channel;

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

    if (!songQueue.getCurrent()) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("No song is currently playing!")
            .setDescription(
              "You need to play a song first before seeking a timestamp"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    if (!TIMESTAMP_REGEX.test(timestamp)) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Invalid Timestamp :(")
            .setDescription(
              "Make sure the timestamp is one of these formats: hh:mm:ss OR mm:ss"
            )
            .setColor("DarkGold"),
        ],
      });
      return;
    }

    const matchedTimestamp = timestamp.match(TIMESTAMP_REGEX)[0];

    const seconds = convertTimeStampToSeconds(matchedTimestamp);

    const current = songQueue.getCurrent();

    current.seek = seconds;

    const stream = await play.stream(current.url, { seek: current.seek });

    const audioResource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    songQueue.justSeeked = true;

    audioPlayer.play(audioResource);

    songQueue.collector.resetTimer();

    sendReplyFunction({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Starting song from ${matchedTimestamp}`)
          .setDescription(`Current Song: ${current.title}`)
          .setURL(current.url)
          .setThumbnail(current.thumbnail_url)
          .setColor("DarkGreen"),
      ],
    });
  } catch (error) {
    console.log(error);
    if (error.message?.includes("Seeking beyond limit")) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Seeking Beyond Limit!")
            .setDescription(
              "Make sure your timestamp does not exceed the length of the song!"
            )
            .setColor("DarkRed"),
        ],
      });
    } else {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("Invalid Timestamp!")
            .setDescription(
              "Make sure the timestamp is one of these formats: HH:MM:SS OR MM:SS"
            )
            .setColor("DarkRed"),
        ],
      });
    }
  }
};

export const executeSeekSongTimeSecondsRaw = async (
  seconds: number,
  songQueue: SongQueue,
  audioPlayer: AudioPlayer,
  sendReplyFunction: sendReplyFunction
) => {
  try {
    if (!songQueue.getCurrent()) {
      sendReplyFunction({
        embeds: [
          new EmbedBuilder()
            .setTitle("No song is currently playing!")
            .setDescription(
              "You need to play a song first before seeking a timestamp"
            )
            .setColor("DarkRed"),
        ],
      });
      return;
    }

    const current = songQueue.getCurrent();

    current.seek = seconds;

    console.log(current.seek);

    const stream = await play.stream(current.url, { seek: current.seek });

    const audioResource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    songQueue.justSeeked = true;

    audioPlayer.play(audioResource);

    songQueue.collector.resetTimer();
  } catch (error) {
    console.log(error);
  }
};
