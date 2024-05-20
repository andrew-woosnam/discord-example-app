import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// Command containing options
const JOIN_COMMAND = {
  name: 'join',
  description: 'Join voice channel',
  type: 1,
};

export const ALL_COMMANDS = [TEST_COMMAND, JOIN_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);