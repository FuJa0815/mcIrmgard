import {CommandInteraction} from "discord.js";
import {SlashCommandStringOption} from "@discordjs/builders/dist/interactions/slashCommands/options/string";
import {SlashCommandBuilder} from "@discordjs/builders";
import {getSongInfoByTerm} from "./search";

module.exports.data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play')
    .addStringOption((option: SlashCommandStringOption) =>
        option.setName('term')
            .setDescription('The YouTube search term')
            .setRequired(true));

module.exports.execute = async function(interaction : CommandInteraction) {
    let term = interaction.options.getString('term');
    if (term === null)
    {
        console.error('play called without term');
        return;
    }

    await interaction.reply((await getSongInfoByTerm(term)).videoDetails.title);
}