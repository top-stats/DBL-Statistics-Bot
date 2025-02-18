import { Interaction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
config();


(async () => {
  const commands = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = './src/commands';
  const commandFolders = (await fs.readdir(foldersPath)).filter(file => !file.endsWith('.ts'));

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.ts'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const { default: command } = await import(`../src/commands/${folder}/${file}`);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] The command at ${folder}/${file} is missing a required "data" or "execute" property.`);
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(process.env.DISCORD_TOKEN || "");

  // and deploy your commands!
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID || "", process.env.DISCORD_DEV_GUILD_ID || ""),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();