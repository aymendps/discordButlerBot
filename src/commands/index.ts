import { Command } from "../interfaces/command";
import { AddSongCommand } from "./addSong";
import { HelloCommand } from "./hello";
import { PlaySongCommand } from "./playSong";
import { SkipSongCommand } from "./skipSong";

export const Commands: Command[] = [
  HelloCommand,
  AddSongCommand,
  PlaySongCommand,
  SkipSongCommand,
];
