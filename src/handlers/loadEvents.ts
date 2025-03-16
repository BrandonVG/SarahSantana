import { readdirSync } from 'fs';
import * as path from 'path';
import SaraClient from '../utils/client';

export default async (client: SaraClient) => {
  try {
    const eventsFiles = readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.ts'));
    for (const file of eventsFiles){
      const event = (await import(`../events/${file}`)).default;
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
  catch (error) {
    console.error(error);
  }
};
