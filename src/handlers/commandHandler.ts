import { readdirSync } from 'fs';
import path from 'path';
import SaraClient from '../utils/client';

export default async function loadCommands(client: SaraClient){
  try {

    const commandFolders = readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandFolders){
      const commandFiles = readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.ts'));
      for (const file of commandFiles){
        const command = (await import(`../commands/${folder}/${file}`)).default;
        client.commands.set(command.data.name, command);
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}