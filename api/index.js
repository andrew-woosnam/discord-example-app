import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from '../utils.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({
  verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}));

app.get('/', (req, res) => {
  res.send('Hello, this is a simple Express API!');
});

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;
  console.log('Received interaction:', req.body);

  // Handle verification requests
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle slash command requests
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
  }

  // If interaction type is unhandled, send a 400 error
  return res.status(400).send('Unhandled interaction type');
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
