import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {getVoiceChannelOfCaller} from "../voiceChatHelper";

module.exports.data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong');

module.exports.execute = async function(interaction : CommandInteraction) {

    await interaction.reply('Pong!' + await getVoiceChannelOfCaller(interaction));
}