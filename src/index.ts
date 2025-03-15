import {Events, GatewayIntentBits } from 'discord.js';
import SaraClient from './utils/client';
import { config } from './config';

import loadCommands from './handlers/commandHandler';

const client = new SaraClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

(async () => {
  await loadCommands(client);
  client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });
  client.login(config.DISCORD_TOKEN);
})();