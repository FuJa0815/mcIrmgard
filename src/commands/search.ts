import {CommandInteraction} from "discord.js";
import {SlashCommandStringOption} from "@discordjs/builders/dist/interactions/slashCommands/options/string";
import {SlashCommandBuilder} from "@discordjs/builders";
import ytdl, {videoInfo} from "ytdl-core";
import {ytToken} from "../config.json";
import * as https from "https";


module.exports.data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a YouTube video')
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

    await interaction.reply((await this.getSongInfoByTerm(term)).videoDetails.title);
}

export function getSongInfoByTerm(term: string): Promise<videoInfo> {
    if (ytdl.validateURL(term))
        return getSongInfo(term);

    return new Promise(function (resolve, reject) {
        https.get(`https://youtube.googleapis.com/youtube/v3/search?maxResults=1&q=${term}&key=${ytToken}&type=video`, function(res) {
            let body = '';
            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', async function(){
                let jsonResponse = JSON.parse(body);
                resolve(await getSongInfo(jsonResponse.items[0].id.videoId));
            });
        }).on('error', function(e) {
            console.error('YouTube API error: ', e);
            reject(e);
        });
    });
}

async function getSongInfo(ytId: string): Promise<videoInfo> {
    return await ytdl.getInfo(ytId);
}