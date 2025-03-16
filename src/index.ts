import { Events, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import sequelize from './database/database';
import SaraClient from './utils/client';
import loadCommands from './handlers/loadCommands';
import loadEvents from './handlers/loadEvents';
import registerCommands from './handlers/registerCommands';

const client = new SaraClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

(async () => {
  await loadCommands(client);
  console.log('Commands loaded');
  await registerCommands(client);
  console.log('Commands registered');
  await loadEvents(client);
  console.log('Events loaded');
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection to the database has been established successfully.');
  }
  catch(error){
    console.error(error);
    process.exit(1);
  }
  client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });
  client.login(config.DISCORD_TOKEN);
})();