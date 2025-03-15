import {Interaction, MessageFlags } from 'discord.js';
import { hasPermission } from '../utils/permissions';
import SaraClient from '../utils/client';

export default {
  name: 'interactionCreate',
  async execute(interaction: Interaction, client: SaraClient){
    const userRoles = interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.map((role) => role.id) || [];
    let commandName: string | undefined;
    if (interaction.isChatInputCommand()) commandName = interaction.commandName;
    else if (interaction.isButton()) commandName = interaction.customId;
    if (!commandName) return;

    const handler = client.commands.get(commandName);
    if (!handler) return;

    const isAllowed = await hasPermission(commandName, userRoles);
    if (!isAllowed) {
      if (interaction.isRepliable()) {
        return interaction.reply({ content: 'No tienes permisos para ejecutar esta acción.', flags: MessageFlags.Ephemeral });
      }
    }

    try {
      await handler.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.isRepliable()) {
        await interaction.reply({ content: 'Hubo un error al ejecutar esta acción, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
      }
    }
  }
}


