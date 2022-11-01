import { Command } from "../interfaces/command";
import { AddSongCommand } from "./addSong";
import { HelloCommand } from "./hello";

export const Commands: Command[] = [HelloCommand, AddSongCommand];
