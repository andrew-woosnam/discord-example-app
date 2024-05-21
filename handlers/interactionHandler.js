import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { client } from '../bot.js'

export async function handleInteraction(req, res) {
    try {
        const { type, data } = req.body;
        console.log('Received interaction:', req.body);

        // Handle verification requests
        if (type === InteractionType.PING) {
            return res.send({ type: InteractionResponseType.PONG });
        }

        // Handle slash command requests
        if (type === InteractionType.APPLICATION_COMMAND) {
            const { name } = data;

            switch (name) {
                case "test":
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'hello world',
                        },
                    });

                case "join":
                    const guildId = req.body.guild_id;
                    const guild = client.guilds.cache.get(guildId);
                    const member = guild.members.cache.get(req.body.member.user.id);
                    const channel = member.voice.channel;

                    if (channel === null && channel === undefined) {
                        return res.status(400).send({
                            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                            data: {
                                content: "You need to join a voice channel first!",
                            },
                        });
                    }

                    const connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator,
                    });

                    connection.on(VoiceConnectionStatus.Ready, () => {
                        console.log('The bot has connected to the channel!');
                    });

                    connection.on(VoiceConnectionStatus.Disconnected, () => {
                        console.log('Disconnected from the channel');
                    });

                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'Joined your voice channel!',
                        },
                    });

                default:
                    return res.status(400).send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'Unhandled interaction type: ' + name,
                        },
                    });
            }

        }
    } catch (error) {
        console.error(error);

        return res.status(400).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: error,
            },
        });
    }
}