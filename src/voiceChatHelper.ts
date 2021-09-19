import {CommandInteraction, GuildChannel, StageChannel, VoiceChannel} from "discord.js";

export function getVoiceChannelOfCaller(interaction : CommandInteraction): VoiceChannel | StageChannel | null {
    if (interaction.guild == null)
        return null;

    let channel = interaction.guild.voiceStates.cache.filter(vs => vs.member?.user.id == interaction.user.id).first()?.channel;
    if (channel == undefined)
        return null;

    return channel;
}