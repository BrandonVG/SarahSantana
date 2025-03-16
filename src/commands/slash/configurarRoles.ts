import { SlashCommandBuilder, Role as DiscordRole, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('configurar_roles')
    .setDescription('Carga los roles del servidor en la base de datos'),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const roles = interaction.guild?.roles.cache.map((role) => role) || [];
      for (const role of roles) {
        await Role.findOrCreate({
          where: {
            roleId: role.id,
            guildId: interaction.guildId
          }
        });
      }
      await interaction.reply({ content: 'Roles cargados en la base de datos, por favor siga con la configuración inicial :)', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al cargar los roles en la base de datos, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}