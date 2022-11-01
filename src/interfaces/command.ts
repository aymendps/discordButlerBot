import { AudioPlayer } from "@discordjs/voice";
import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from "discord.js";
import { Song } from "./song";

export interface Command extends ChatInputApplicationCommandData {
  run: (
    client: Client,
    interaction: CommandInteraction,
    songQueue: Song[],
    audioPlayer: AudioPlayer
  ) => void;
}
