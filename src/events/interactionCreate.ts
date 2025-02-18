import { Client, Interaction, MessageFlags } from "discord.js";
import commandHandler from "../commands";

export default async function InteractionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commandHandler.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      });
    }
  }
}