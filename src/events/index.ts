import { AudioPlayer } from "@discordjs/voice";
import { Client } from "discord.js";
import { Song } from "../interfaces/song";
import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";
import ready from "./ready";

const establishListeners = (
  client: Client,
  songQueue: Song[],
  audioPlayer: AudioPlayer
) => {
  ready(client);
  interactionCreate(client, songQueue, audioPlayer);
  messageCreate(client, songQueue, audioPlayer);
};

export default establishListeners;
