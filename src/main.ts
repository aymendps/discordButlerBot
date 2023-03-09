import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import * as Discord from "discord.js";
import { TOKEN } from "./config";
import establishListeners from "./events";
import { SongQueue } from "./interfaces/song";
import { createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";

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

const songQueue = new SongQueue();

const audioPlayer = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

const main = async () => {
  try {
    console.log("Establishing Butler Bot's listeners...");
    establishListeners(client, songQueue, audioPlayer);
    console.log("Butler Bot is starting...");
    await client.login(TOKEN);
  } catch (error) {
    console.log(error);
  }
};

main();
