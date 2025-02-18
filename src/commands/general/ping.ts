import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const pingCommandData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export default {
  data: pingCommandData,
  execute: async (interaction: CommandInteraction) => {
    interaction.reply('Pong!')
  }
};
