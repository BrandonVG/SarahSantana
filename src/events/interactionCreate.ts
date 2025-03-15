import {Interaction, MessageFlags } from 'discord.js';
import { hasPermission } from '../utils/permissions';

export default {
  name: 'interactionCreate',
  async execute(interaction: Interaction, client: any){
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const userRoles = interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.map((role) => role.id) || [];

    const isAllowed = await hasPermission(interaction.commandName, userRoles);
    if (!isAllowed) {
      return interaction.reply({ content: 'No tienes permisos para ejecutar este comando', flags: MessageFlags.Ephemeral });
    }

    try {
      await command.execute(interaction);
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al ejecutar el comando', flags: MessageFlags.Ephemeral });
    }
  }
}