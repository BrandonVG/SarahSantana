import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import SaraClient from '../utils/client';
import { config } from '../config';

export default async function registerCommands(client: SaraClient) {
  const commands = client.commands.filter(cmd => cmd.data instanceof SlashCommandBuilder).map(cmd => cmd.data.toJSON());

  const rest = new REST().setToken(config.DISCORD_TOKEN);

  try {
    // await rest.put(
    //   Routes.applicationCommands(config.CLIENT_ID),
    //   { body: commands }
    // );

    await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.TEST_GUILD_ID),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
}
