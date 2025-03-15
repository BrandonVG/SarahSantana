import { Events, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import SaraClient from './utils/client';
import loadCommands from './handlers/commandHandler';
import registerCommands from './handlers/registerCommands';

const client = new SaraClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

(async () => {
  await loadCommands(client);
  await registerCommands(client);
  client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });
  client.login(config.DISCORD_TOKEN);
})();