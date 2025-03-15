import { SlashCommandBuilder, Role as DiscordRole, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('configurar_roles')
    .setDescription('Carga los roles del servidor en la base de datos'),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const rolesIds = interaction.guild?.roles.cache.map((role) => role) || [];
      rolesIds.forEach(async (role: DiscordRole) => {
        await Role.findOrCreate( { where: { roleId: role.id} } );
      });
      await interaction.reply({ content: 'Roles cargados en la base de datos, por favor siga con la configuración inicial :)', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al cargar los roles en la base de datos, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}