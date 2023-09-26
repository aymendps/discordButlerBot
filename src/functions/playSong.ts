import {
  EmbedBuilder,
  GuildMember,
  Client,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { Song, SongQueue } from "../interfaces/song";
import { executeAddSong } from "./addSong";
import { sendReplyFunction } from "../interfaces/sendReplyFunction";
import play from "play-dl";
import { executeSkipSong } from "./skipSong";

export const playSong = async (
  connection: VoiceConnection,
  audioPlayer: AudioPlayer,
  songQueue: SongQueue,
  currentSong: Song,
  successReply: (song: Song, remaining: number) => void,
  errorReply: () => void,
  finishReply: () => void,
  allowReply = true
) => {
  try {
    audioPlayer.removeAllListeners();

    if (!currentSong) {
      connection.destroy();
      finishReply();
      return;
    }

    const seek = Number(currentSong.seek || 0);

    let toPlay = currentSong.url;

    if (currentSong.url.includes("spotify")) {
      const searchForAlternative = await play.search(currentSong.title, {
        limit: 1,
      });
      toPlay = searchForAlternative[0].url;
      console.log("using alternative url: " + toPlay);
    }

    const stream = await play.stream(toPlay, { seek: seek });

    const audioResource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    audioPlayer.on("stateChange", (oldState, newState) => {
      console.log(newState.status);
      if (newState.status === AudioPlayerStatus.Idle) {
        if (
          audioResource.playbackDuration < 500 &&
          audioResource.playbackDuration > 0
        ) {
          console.log(
            `Couldn't find nearest block with seek: ${currentSong.seek}. Trying with next seek!`
          );
          currentSong.seek++;
          playSong(
            connection,
            audioPlayer,
            songQueue,
            currentSong,
            successReply,
            errorReply,
            finishReply,
            false
          );
        } else {
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
      }
    });

    audioPlayer.on("error", (error) => {
      if (
        error.message.includes("Failed to find nearest Block") &&
        currentSong.seek
      ) {
        console.log(
          `Couldn't find nearest block with seek: ${currentSong.seek}. Trying with next seek!`
        );
        currentSong.seek++;
        playSong(
          connection,
          audioPlayer,
          songQueue,
          currentSong,
          successReply,
          errorReply,
          finishReply,
          false
        );
      } else {
        console.log(error);
        errorReply();
      }
    });

    audioPlayer.play(audioResource);
    if (allowReply) successReply(currentSong, songQueue.length());
  } catch (error) {
    throw error;
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

    connection.subscribe(audioPlayer);

    if (urlArg) {
      await executeAddSong(urlArg, songQueue, sendReplyFunction);
    }

    if (!songQueue.getCurrent()) {
      playSong(
        connection,
        audioPlayer,
        songQueue,
        songQueue.pop(),
        async (song, remaining) => {
          const response = await sendReplyFunction({
            embeds: [
              new EmbedBuilder()
                .setTitle("Playing " + song.title)
                .setURL(song.url)
                .setDescription(
                  "There are " +
                    remaining +
                    " other songs remaining in the queue"
                )
                .setThumbnail(song.thumbnail_url)
                .setColor("DarkGreen"),
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setLabel("Open")
                  .setURL(song.url)
                  .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                  .setCustomId("skip")
                  .setLabel("Skip")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });
          try {
            const songTitle = song.title;
            const confirmation = await response.awaitMessageComponent({
              time: song.duration * 1000,
            });
            if (confirmation.customId === "skip") {
              if (songTitle !== songQueue.getCurrent().title) {
                throw "Song was already skipped!";
              }
              await confirmation.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Playing " + song.title)
                    .setURL(song.url)
                    .setDescription(
                      "There are " +
                        remaining +
                        " other songs remaining in the queue"
                    )
                    .setThumbnail(song.thumbnail_url)
                    .setColor("DarkGreen"),
                ],
                components: [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setLabel("Open")
                      .setURL(song.url)
                      .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                      .setCustomId("skipped")
                      .setLabel("Skipped!")
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(true)
                  ),
                ],
              });
              await executeSkipSong(
                client,
                member,
                songQueue,
                audioPlayer,
                sendReplyFunction
              );
            }
          } catch (error) {
            response.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Playing " + song.title)
                  .setURL(song.url)
                  .setDescription(
                    "There are " +
                      remaining +
                      " other songs remaining in the queue"
                  )
                  .setThumbnail(song.thumbnail_url)
                  .setColor("DarkGreen"),
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setLabel("Open")
                    .setURL(song.url)
                    .setStyle(ButtonStyle.Link),
                  new ButtonBuilder()
                    .setCustomId("finished")
                    .setLabel("Finished!")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
                ),
              ],
            });
          }
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
    }
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
            .setTitle("Something went wrong")
            .setDescription("Could not add or play the request song...")
            .setColor("DarkRed"),
        ],
      });
    }
  }
};
