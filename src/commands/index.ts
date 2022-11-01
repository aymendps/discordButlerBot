import { Command } from "../interfaces/command";
import { AddSongCommand } from "./addSong";
import { HelloCommand } from "./hello";
import { PlaySongCommand } from "./playSong";

export const Commands: Command[] = [
  HelloCommand,
  AddSongCommand,
  PlaySongCommand,
];
