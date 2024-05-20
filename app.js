import 'dotenv/config';
import express from 'express';
import { VerifyDiscordRequest } from './utils.js';
import { handleInteraction } from './handlers/interactionHandler.js';
import { ALL_COMMANDS } from './commands.js';
import './bot.js'; // Ensure the bot client is initialized

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({
  verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}));

// Define a GET endpoint
app.get('/', (req, res) => {
  res.send(ALL_COMMANDS.map(command => command.name).join(', '));
});

// Interactions endpoint
app.post('/interactions', handleInteraction);

// Start the Express server
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
