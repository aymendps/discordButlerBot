import {
  CommandInteraction,
  InteractionReplyOptions,
  MessageCreateOptions,
  TextChannel,
} from "discord.js";
import { Command } from "../interfaces/command";
import { AddSongCommand } from "./addSong";
import { findActiveLolMatchCommand } from "./findActiveLolMatch";
import { FindLolPlayerCommand } from "./findLolPlayer";
import { HelloCommand } from "./hello";
import { LoopSongCommand } from "./loopSong";
import { PlaySongCommand } from "./playSong";
import { SkipSongCommand } from "./skipSong";
import { StopSongCommand } from "./stopSong";
import { RemoveSongCommand } from "./removeSong";
import { SeekSongTimeCommand } from "./seekSongTime";

export const sendInteractionReply = async (
  interaction: CommandInteraction,
  options: InteractionReplyOptions
) => {
  try {
    return await interaction.followUp(options);
  } catch (error) {
    const channel = interaction.channel as TextChannel;
    return await channel.send(options as MessageCreateOptions);
  }
};

export const Commands: Command[] = [
  HelloCommand,
  AddSongCommand,
  PlaySongCommand,
  SkipSongCommand,
  StopSongCommand,
  LoopSongCommand,
  RemoveSongCommand,
  SeekSongTimeCommand,
  FindLolPlayerCommand,
  findActiveLolMatchCommand,
];
