import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import * as Discord from "discord.js";
import ytdl from "ytdl-core";
import { prefix, token } from "./config";

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

const establishConnection = async () => {
  try {
    console.log("Butler Bot is starting...");

    await client.login(token);

    console.log("Butler Bot has started!");
  } catch (error) {
    console.log(error);
  }
};

establishConnection();
