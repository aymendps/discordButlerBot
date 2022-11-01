import { Client } from "discord.js";
import { Song } from "../interfaces/song";
import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";
import ready from "./ready";

const establishListeners = (client: Client, songQueue: Song[]) => {
  ready(client);
  interactionCreate(client, songQueue);
  messageCreate(client, songQueue);
};

export default establishListeners;
