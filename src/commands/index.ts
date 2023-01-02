import { Command } from "../interfaces/command";
import { AddSongCommand } from "./addSong";
import { FindLolPlayerCommand } from "./findLolPlayer";
import { HelloCommand } from "./hello";
import { PlaySongCommand } from "./playSong";
import { SkipSongCommand } from "./skipSong";
import { StopSongCommand } from "./stopSong";

export const Commands: Command[] = [
  HelloCommand,
  AddSongCommand,
  PlaySongCommand,
  SkipSongCommand,
  StopSongCommand,
  FindLolPlayerCommand,
];
