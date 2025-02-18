import { Collection, SlashCommandBuilder } from "discord.js";
import path from 'path';
import fs from 'fs/promises';
import { CommandCollection } from "../types";

const commands: CommandCollection = new Collection();

const foldersPath = path.join(__dirname);

async function init() {
  const commandFolders = await fs.readdir(foldersPath);
  for (const folder of commandFolders.filter(f => !f.endsWith('.ts'))) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = await fs.readdir(commandsPath);
    for (const file of commandFiles.filter(f => f.endsWith('.ts'))) {
      const { default: command } = await import(`./${folder}/${file}`);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

export default {
  commands,
  init
}