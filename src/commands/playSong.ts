import { AudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import {
  CommandInteraction,
  Client,
  EmbedBuilder,
  ApplicationCommandOptionType,
  GuildMember,
  ChannelType,
} from "discord.js";
import { addSong } from "../functions/addSong";
import { playSong } from "../functions/playSong";
import { Command } from "../interfaces/command";
import { Song } from "../interfaces/song";

export const PlaySongCommand: Command = {
  name: "play",
  description: "Start playing music",
  options: [
    {
      name: "url",
      description: "The URL of the song to be added",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
    songQueue: Song[],
    audioPlayer: AudioPlayer
  ) => {
    try {
      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice.channel;

      if (
        interaction.guild.channels.cache.some(
          (channel) =>
            channel.type === ChannelType.GuildVoice &&
            channel.members.has(interaction.client.user.id)
        )
      ) {
        interaction.followUp({
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
        interaction.followUp({
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

      const permissions = voiceChannel.permissionsFor(interaction.client.user);

      if (!permissions.has("Connect") || !permissions.has("Speak")) {
        interaction.followUp({
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

      const url = interaction.options.get("url");

      if (url) {
        if (url.value) {
          // additional url was given
          const song = await addSong(url.value as string, songQueue);
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setTitle(song.title)
                .setURL(song.url)
                .setDescription(
                  "Added " + song.title + " to the queue: #" + songQueue.length
                )
                .setThumbnail(song.thumbnail_url)
                .setColor("DarkGreen"),
            ],
          });
        }
      }

      playSong(
        connection,
        audioPlayer,
        songQueue,
        songQueue[0],
        (song, remaining) => {
          interaction.followUp({
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
          });
        },
        () => {
          interaction.followUp({
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
          interaction.followUp({
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
  },
};
