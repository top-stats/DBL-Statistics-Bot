import { Collection, CommandInteraction } from "discord.js";

export type CommandCollection = Collection<string, { data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => void }> 