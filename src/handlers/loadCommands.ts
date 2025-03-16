import { readdirSync } from 'fs';
import * as path from 'path';
import SaraClient from '../utils/client';
import Command from '../models/Command';

export default async function loadCommands(client: SaraClient){
  try {
    const commandFolders = readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandFolders){
      const commandFiles = readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
      for (const file of commandFiles){
        const command = (await import(`../commands/${folder}/${file}`)).default;
        client.commands.set(command.data.name, command);
      }
    }
    await Command.bulkCreate(client.commands.map(cmd => ({ name: cmd.data.name, description: cmd.data.description })), { ignoreDuplicates: true });
  }
  catch (error) {
    console.error(error);
  }
}