import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import topStatsAPI from "../../util/topstats";

const pingCommandData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export default {
  data: pingCommandData,
  execute: async (interaction: CommandInteraction) => {
    const bot = await topStatsAPI.getBot('583807014896140293')
    interaction.reply('Pong! We have ' + bot.monthly_votes + ' votes this month')
  }
};
