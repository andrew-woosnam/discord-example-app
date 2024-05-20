import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { VerifyDiscordRequest, getRandomEmoji } from '../utils.js';
import { ALL_COMMANDS } from '../commands.js';

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({
  verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}));

// Discord.js client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Define a GET endpoint
app.get('/', (req, res) => {
  res.send(ALL_COMMANDS.map(command => command.name).join(', '));
});

// Interactions endpoint
app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;
  console.log('Received interaction:', req.body);

  // Handle verification requests
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle slash command requests
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    if (name === 'join') {
      const guildId = req.body.guild_id;
      const guild = client.guilds.cache.get(guildId);
      const member = guild.members.cache.get(req.body.member.user.id);

      if (member.voice.channel) {
        const connection = joinVoiceChannel({
          channelId: member.voice.channel.id,
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
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'You need to join a voice channel first!',
          },
        });
      }
    }
  }

  // If interaction type is unhandled, send a 400 error
  return res.status(400).send('Unhandled interaction type');
});

// Start the Express server
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

// Login to Discord
client.login(process.env.BOT_TOKEN);
