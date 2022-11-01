import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import * as Discord from "discord.js";
import { token } from "./config";
import establishListeners from "./events";
import { Song } from "./interfaces/song";

const client = new Discord.Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent",
    "GuildMembers",
    "GuildVoiceStates",
    "GuildPresences",
  ],
});

const songQueue: Song[] = [];

const main = async () => {
  try {
    console.log("Establishing Butler Bot's listeners...");
    establishListeners(client, songQueue);
    console.log("Butler Bot is starting...");
    await client.login(token);
  } catch (error) {
    console.log(error);
  }
};

main();
