import {Interaction, Client, Intents, CommandInteraction} from "discord.js";
import * as fs from "fs";
import {REST} from "@discordjs/rest";
import {token} from "./config.json";
import {Routes} from "discord-api-types/v9";


const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES ] });

const commands: string[] = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

let commandRequires: { [name: string]: any } = {};

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    for (const file of commandFiles) {
        let fileName = file.replace(/.ts$/, "");
        await import(`./commands/${fileName}`).then(function(command) {
            commandRequires[fileName] = command;
            // @ts-ignore
            commands.push(command.data);
        });
    }
})().then(_ => {
    async function tryRegisterSlashCommands(guildId: string) {
        try {
            if (client.user !== null) {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guildId),
                    {body: commands},
                );
            }
            else {
                console.error("client.user is null");
            }

            console.log('Successfully registered application commands.');
        } catch (error) {
            console.error(error);
        }
    }

    client.once('ready', async () => {
        for (const guildId of client.guilds.cache.map(g => g.id))
            await tryRegisterSlashCommands(guildId);

        console.log('Ready!');
    });
    client.once('reconnecting', () => {
        console.log('Reconnecting!');
    });
    client.once('disconnect', () => {
        console.log('Disconnect!');
    });

    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        await commandRequires[commandName].execute(interaction);
    });

    client.on('guildCreate', async guild => {
        await tryRegisterSlashCommands(guild.id);
    });

    client.login(token).then(_ => console.log('Logged in!'));
});